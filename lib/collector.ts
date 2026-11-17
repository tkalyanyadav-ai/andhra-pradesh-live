type Statement = { bind(...values: unknown[]): Statement; all<T=Record<string,unknown>>(): Promise<{results:T[]}>; run(): Promise<unknown>; };
type Database = { prepare(sql:string): Statement };
type Source = { id:string; name:string; url:string };
type Env = { DB: Database; GEMINI_API_KEY?: string };
const MODEL = "gemini-2.5-flash";
const schema = {
  type:"OBJECT",
  properties:{items:{type:"ARRAY",items:{type:"OBJECT",properties:{
    title:{type:"STRING"},summary:{type:"STRING"},category:{type:"STRING",enum:["Government Order","Recruitment","IAS/IPS","District Update","Amaravati","Scheme","Public Notice","Other"]},
    publishedAt:{type:"STRING"},isRelevant:{type:"BOOLEAN"}
  },required:["title","summary","category","publishedAt","isRelevant"]}}},required:["items"]
};
function cleanHtml(html:string) {
  return html.replace(/<(script|style|noscript|svg)[^>]*>[\s\S]*?<\/\1>/gi," ")
    .replace(/<(br|\/p|\/div|\/li|\/tr|\/h[1-6])\b[^>]*>/gi,"\n")
    .replace(/<[^>]+>/g," ").replace(/&nbsp;|&#160;/gi," ")
    .replace(/&amp;/gi,"&").replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'")
    .replace(/&lt;/gi,"<").replace(/&gt;/gi,">")
    .replace(/[\t\r ]+/g," ").replace(/\n\s*/g,"\n").trim().slice(0,18000);
}
async function fingerprint(value:string) {
  const bytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value.toLowerCase().replace(/\s+/g," ").trim()));
  return [...new Uint8Array(bytes)].map(x=>x.toString(16).padStart(2,"0")).join("");
}
async function summarize(apiKey:string,source:Source,text:string) {
  const prompt = `You are an evidence extraction assistant for an Andhra Pradesh public information portal. Read the source text below. Extract only clearly stated, Andhra Pradesh-relevant public updates. Do not infer facts, invent dates, GO numbers, names, deadlines or locations. Exclude navigation, advertisements and unrelated content. Summaries must be neutral and factual, maximum 70 words. publishedAt must be an explicit source publication date in YYYY-MM-DD format or an empty string. If the source has no clear substantive update, return an empty items array. Every item must be supported by this source.\nSOURCE NAME: ${source.name}\nSOURCE URL: ${source.url}\nSOURCE TEXT:\n${text}`;
  const response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,{
    method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":apiKey},
    body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{temperature:0.1,maxOutputTokens:2048,responseMimeType:"application/json",responseSchema:schema}})
  });
  if(!response.ok) throw new Error(`Gemini API returned HTTP ${response.status}`);
  const data=await response.json() as {candidates?:Array<{content?:{parts?:Array<{text?:string}>}}>} ;
  const raw=data.candidates?.[0]?.content?.parts?.map(p=>p.text??"").join("")??"";
  if(!raw) return [];
  const parsed=JSON.parse(raw) as {items?:Array<{title:string;summary:string;category:string;publishedAt:string;isRelevant:boolean}>};
  return (parsed.items??[]).filter(x=>x.isRelevant&&typeof x.title==="string"&&x.title.trim()&&typeof x.summary==="string"&&x.summary.trim()).slice(0,12);
}
export async function collectOfficialSources(env:Env) {
  if(!env.DB) throw new Error("D1 binding DB is unavailable");
  if(!env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY secret is missing");
  const rows=await env.DB.prepare("SELECT id,name,url FROM sources WHERE active=1 AND source_type='OFFICIAL' ORDER BY name").all<Source>();
  const report={sources:rows.results.length,checked:0,queued:0,skipped:0,errors:[] as string[]};
  for(const source of rows.results) {
    try {
      const response=await fetch(source.url,{headers:{"User-Agent":"AndhraPradeshLiveBot/1.0 (+official-source monitoring; contact via website)","Accept":"text/html,application/xhtml+xml"},signal:AbortSignal.timeout(18000)});
      if(!response.ok) throw new Error(`Source returned HTTP ${response.status}`);
      const html=(await response.text()).slice(0,350000);
      const text=cleanHtml(html);
      if(text.length<120) throw new Error("Source page did not contain enough readable text");
      const items=await summarize(env.GEMINI_API_KEY,source,text);
      for(const item of items) {
        const fp=await fingerprint(source.url+"|"+item.title);
        const id=crypto.randomUUID();
        const date=/^\d{4}-\d{2}-\d{2}$/.test(item.publishedAt)?item.publishedAt:null;
        const result=await env.DB.prepare("INSERT OR IGNORE INTO collector_queue(id,fingerprint,source_id,title,summary,category,source_url,published_at) VALUES(?,?,?,?,?,?,?,?)")
          .bind(id,fp,source.id,item.title.trim().slice(0,240),item.summary.trim().slice(0,1200),item.category,source.url,date).run() as {meta?:{changes?:number}};
        if(result.meta?.changes) report.queued++; else report.skipped++;
      }
      await env.DB.prepare("UPDATE sources SET last_checked_at=CURRENT_TIMESTAMP WHERE id=?").bind(source.id).run();
      report.checked++;
    } catch(error) {
      report.errors.push(`${source.name}: ${error instanceof Error?error.message:"unknown error"}`);
    }
  }
  return report;
}