import {getDatabase,jsonError,makeId} from "@/lib/cloudflare-db";
export const dynamic="force-dynamic";
function authorized(req:Request){
 const expected=process.env.ADMIN_API_TOKEN??"";
 const got=req.headers.get("authorization")?.replace(/^Bearer\s+/i,"")??"";
 if(!expected||got.length!==expected.length)return false;
 let diff=0;for(let i=0;i<expected.length;i++)diff|=expected.charCodeAt(i)^got.charCodeAt(i);
 return diff===0;
}
export async function GET(req:Request){
 if(!authorized(req))return jsonError("Unauthorized",401);
 const db=await getDatabase();if(!db)return jsonError("Database unavailable",503);
 const rows=await db.prepare("SELECT q.id,q.title,q.summary,q.category,q.source_url,q.published_at,q.detected_at,s.name AS source_name FROM collector_queue q JOIN sources s ON s.id=q.source_id WHERE q.status='PENDING' ORDER BY q.detected_at DESC LIMIT 100").all();
 return Response.json({items:rows.results});
}
export async function POST(req:Request){
 if(!authorized(req))return jsonError("Unauthorized",401);
 const body=await req.json().catch(()=>null) as {id?:string;action?:string}|null;
 if(!body?.id||!["approve","reject"].includes(body.action??""))return jsonError("Provide an item id and approve/reject action");
 const db=await getDatabase();if(!db)return jsonError("Database unavailable",503);
 const item=await db.prepare("SELECT id,title,summary,category,source_url,published_at FROM collector_queue WHERE id=? AND status='PENDING'").bind(body.id).first<Record<string,unknown>>();
 if(!item)return jsonError("Pending item not found",404);
 try{
  if(body.action==="approve"){
   const title=String(item.title);const slug=title.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,90)+"-"+makeId().slice(0,8);
   await db.prepare("INSERT INTO articles(id,slug,title,summary,category,source_url,published_at,verification_status,is_demo) VALUES(?,?,?,?,?,?,?,'CONFIRMED',0)")
    .bind(makeId(),slug,title,String(item.summary),String(item.category),String(item.source_url),typeof item.published_at==="string"?item.published_at:new Date().toISOString()).run();
  }
  await db.prepare("UPDATE collector_queue SET status=?,reviewed_at=CURRENT_TIMESTAMP WHERE id=? AND status='PENDING'").bind(body.action==="approve"?"APPROVED":"REJECTED",body.id).run();
  await db.prepare("INSERT INTO audit_log(id,actor,action,entity_type,entity_id) VALUES(?,?,?,?,?)").bind(makeId(),"admin-token",body.action!.toUpperCase(),"collector_queue",body.id).run();
  return Response.json({ok:true,status:body.action==="approve"?"APPROVED":"REJECTED"});
 }catch{return jsonError("Review action could not be completed",409)}
}