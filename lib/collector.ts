type Statement = { bind(...values: unknown[]): Statement; all<T=Record<string,unknown>>(): Promise<{results:T[]}>; run(): Promise<unknown>; };
type Database = { prepare(sql:string): Statement };
type Source = { id:string; name:string; url:string; source_type:string; content_hash?:string|null };
type Env = { DB: Database; GEMINI_API_KEY?: string };
type Candidate = {title:string;summary:string;category:string;publishedAt:string;isRelevant:boolean;sourceUrl?:string};
const MODEL = "gemini-3.5-flash-lite";
const schema = {type:"OBJECT",properties:{items:{type:"ARRAY",items:{type:"OBJECT",properties:{
 title:{type:"STRING"},summary:{type:"STRING"},category:{type:"STRING",enum:["Government Order","Recruitment","IAS/IPS","District Update","Amaravati","Scheme","Public Notice","Politics","Crime & Safety","Business","Agriculture","Education","Weather","Sports","Other"]},
 publishedAt:{type:"STRING"},sourceUrl:{type:"STRING"},isRelevant:{type:"BOOLEAN"}
},required:["title","summary","category","publishedAt","sourceUrl","isRelevant"]}}},required:["items"]};
function cleanHtml(html:string) {
 return html.replace(/<(script|style|noscript|svg)[^>]*>[\s\S]*?<\/\1>/gi," ").replace(/<(br|\/p|\/div|\/li|\/tr|\/h[1-6])\b[^>]*>/gi,"\n").replace(/<[^>]+>/g," ").replace(/&nbsp;|&#160;/gi," ").replace(/&amp;/gi,"&").replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&lt;/gi,"<").replace(/&gt;/gi,">").replace(/[\t\r ]+/g," ").replace(/\n\s*/g,"\n").trim().slice(0,18000);
}
function parseDate(value:string){const d=new Date(value);return Number.isNaN(d.getTime())?"":d.toISOString().slice(0,10);}
function classifyNews(value:string){
 const s=value.toLowerCase();
 if(/amaravati|apcrda|capital city/.test(s))return "Amaravati";
 if(/ias|ips|collector|superintendent of police|transferred|posting/.test(s))return "IAS/IPS";
 if(/appsc|recruitment|notification|vacanc|job|exam|hall ticket|result/.test(s))return "Recruitment";
 if(/\bgovernment order|\bgo\s*(no|ms|rt)|cabinet|secretariat|department order/.test(s))return "Government Order";
 if(/scheme|pension|welfare|benefit|subsidy/.test(s))return "Scheme";
 if(/police|crime|murder|arrest|theft|accident|fire|missing|court|high court/.test(s))return "Crime & Safety";
 if(/rain|cyclone|weather|flood|heatwave|imd/.test(s))return "Weather";
 if(/farmer|agriculture|crop|irrigation|seed|fertili[sz]er/.test(s))return "Agriculture";
 if(/school|college|university|education|student|teacher/.test(s))return "Education";
 if(/industry|investment|company|business|factory| ಉದ್ಯಮ/.test(s))return "Business";
 if(/election|minister|chief minister|assembly|politic|party/.test(s))return "Politics";
 if(/district|mandal|village|municipal|panchayat/.test(s))return "District Update";
 return "Other";
}
function decodeXml(s:string){return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,"$1").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();}
function rssEntries(xml:string){
 const blocks=[...xml.matchAll(/<(item|entry)\b[^>]*>([\s\S]*?)<\/\1>/gi)].slice(0,30);
 const get=(tag:string)=>decodeXml(b.match(new RegExp("<"+tag+"\\b[^>]*>([\\s\\S]*?)<\\/"+tag+">","i"))?.[1]??"");const link=b.match(/<link\\b[^>]*href=["']([^"']+)["'][^>]*\\/?\\s*>/i)?.[1]??get("link");return {title:get("title"),link:link.trim(),date:get("pubDate")||get("published")||get("updated"),description:(get("description")||get("summary")||get("content")).slice(0,900)};}).filter(x=>x.title&&/^https?:\\/\\//i.test(x.link));
}
async function fingerprint(value:string) {
 const bytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value.toLowerCase().replace(/\s+/g," ").trim()));
 return [...new Uint8Array(bytes)].map(x=>x.toString(16).padStart(2,"0")).join("");
}
async function summarize(apiKey:string,source:Source,text:string,allowedUrls:Set<string>) {
 const prompt=`You extract Andhra Pradesh public-interest news. Return only factual items explicitly supported by supplied source text. Never invent facts, dates, names, locations or URLs. Neutral summaries <=70 words. publishedAt must be YYYY-MM-DD only when an explicit date is present, otherwise empty. sourceUrl MUST be copied exactly from one of the article URLs supplied; for official pages with no article URL use the source URL. Exclude unrelated, duplicate, promotional and unsupported content.\nSOURCE: ${source.name}\nSOURCE URL: ${source.url}\nITEMS:\n${text}`;
 const response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,{method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":apiKey},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{temperature:0.1,maxOutputTokens:4096,responseMimeType:"application/json",responseSchema:schema}})});
 if(!response.ok)throw new Error(`Gemini API returned HTTP ${response.status}`);
 const data=await response.json() as {candidates?:Array<{content?:{parts?:Array<{text?:string}>}}>} ;
 const raw=data.candidates?.[0]?.content?.parts?.map(p=>p.text??"").join("")??"";
 if(!raw)return [];
 const parsed=JSON.parse(raw) as {items?:Candidate[]};
 return (parsed.items??[]).filter(x=>x.isRelevant&&x.title?.trim()&&x.summary?.trim()&&allowedUrls.has(x.sourceUrl||"")).slice(0,20);
}
export async function collectOfficialSources(env:Env) {
 if(!env.DB)throw new Error("D1 binding DB is unavailable");
 if(!env.GEMINI_API_KEY)throw new Error("GEMINI_API_KEY secret is missing");
 const rows=await env.DB.prepare("SELECT s.id,s.name,s.url,s.source_type,st.content_hash FROM sources s LEFT JOIN collector_source_state st ON st.source_id=s.id WHERE s.active=1 ORDER BY CASE s.source_type WHEN 'OFFICIAL' THEN 0 ELSE 1 END,s.name").all<Source>();
 const report={sources:rows.results.length,checked:0,queued:0,skipped:0,errors:[] as string[]};
 for(const source of rows.results){
  try{
   const response=await fetch(source.url,{headers:{"User-Agent":"AndhraPradeshLiveBot/1.0 (+source-attributed public news aggregation)","Accept":source.source_type==="NEWS"?"application/rss+xml, application/atom+xml, application/xml, text/xml":"text/html,application/xhtml+xml"},signal:AbortSignal.timeout(18000)});
   if(!response.ok)throw new Error(`Source returned HTTP ${response.status}`);
   const body=(await response.text()).slice(0,350000);
   let text="",allowedUrls=new Set<string>([source.url]),items:Candidate[]=[];
   if(source.source_type==="NEWS"){
    const entries=rssEntries(body);
    if(!entries.length)throw new Error("RSS/Atom feed contained no readable entries");
    for(const entry of entries)allowedUrls.add(entry.link);
    text=entries.map((e,i)=>`ITEM ${i+1}\nTITLE: ${e.title}\nPUBLISHED: ${e.date}\nARTICLE_URL: ${e.link}\nDESCRIPTION: ${e.description}`).join("\n\n").slice(0,18000);
    // RSS headlines and descriptions are publisher-attributed source material. Queue them directly
    // to avoid spending one Gemini request per feed; editorial review still controls publication.
    items=entries.map(e=>({title:e.title,summary:e.description||e.title,category:classifyNews(e.title+" "+e.description),publishedAt:parseDate(e.date),sourceUrl:e.link,isRelevant:true}));
   }else{text=cleanHtml(body);}
   if(text.length<80)throw new Error("Source page did not contain enough readable text");
   const contentHash=await fingerprint(text);
   if(source.content_hash===contentHash){
    await env.DB.prepare("UPDATE collector_source_state SET last_checked_at=CURRENT_TIMESTAMP,last_error=NULL WHERE source_id=?").bind(source.id).run();
    await env.DB.prepare("UPDATE sources SET last_checked_at=CURRENT_TIMESTAMP WHERE id=?").bind(source.id).run();report.checked++;report.skipped++;continue;
   }
   if(source.source_type!=="NEWS")items=await summarize(env.GEMINI_API_KEY,source,text,allowedUrls);
   for(const item of items){
    const articleUrl=allowedUrls.has(item.sourceUrl||"")?item.sourceUrl!:source.url;
    const fp=await fingerprint(articleUrl+"|"+item.title);
    const date=/^\d{4}-\d{2}-\d{2}$/.test(item.publishedAt)?item.publishedAt:null;
    const result=await env.DB.prepare("INSERT OR IGNORE INTO collector_queue(id,fingerprint,source_id,title,summary,category,source_url,published_at) VALUES(?,?,?,?,?,?,?,?)").bind(crypto.randomUUID(),fp,source.id,item.title.trim().slice(0,240),item.summary.trim().slice(0,1200),item.category,articleUrl,date).run() as {meta?:{changes?:number}};
    if(result.meta?.changes)report.queued++;else report.skipped++;
   }
   await env.DB.prepare("INSERT INTO collector_source_state(source_id,content_hash,last_checked_at,last_error) VALUES(?,?,CURRENT_TIMESTAMP,NULL) ON CONFLICT(source_id) DO UPDATE SET content_hash=excluded.content_hash,last_checked_at=CURRENT_TIMESTAMP,last_error=NULL").bind(source.id,contentHash).run();
   await env.DB.prepare("UPDATE sources SET last_checked_at=CURRENT_TIMESTAMP WHERE id=?").bind(source.id).run();report.checked++;
  }catch(error){
   const message=error instanceof Error?error.message:"unknown error";report.errors.push(`${source.name}: ${message}`);
   await env.DB.prepare("INSERT INTO collector_source_state(source_id,content_hash,last_checked_at,last_error) VALUES(?,'',CURRENT_TIMESTAMP,?) ON CONFLICT(source_id) DO UPDATE SET last_checked_at=CURRENT_TIMESTAMP,last_error=excluded.last_error").bind(source.id,message).run().catch(()=>undefined);
  }
 }
 return report;
}
