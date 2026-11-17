import {getDatabase,jsonError} from "@/lib/cloudflare-db";

export const dynamic="force-dynamic";

function authorized(req:Request){
 const expected=process.env.ADMIN_API_TOKEN??"";
 const got=req.headers.get("authorization")?.replace(/^Bearer\\s+/i,"")??"";
 if(!expected||got.length!==expected.length)return false;
 let diff=0;
 for(let i=0;i<expected.length;i++)diff|=expected.charCodeAt(i)^got.charCodeAt(i);
 return diff===0;
}

export async function GET(req:Request){
 if(!authorized(req))return jsonError("Unauthorized",401);
 const db=await getDatabase();
 if(!db)return jsonError("Database unavailable",503);
 try{
  const result=await db.prepare(`
   SELECT s.id,s.name,s.url,s.source_type,s.last_checked_at AS last_successful_check,
          st.last_checked_at AS last_attempt_at,st.last_error
   FROM sources s
   LEFT JOIN collector_source_state st ON st.source_id=s.id
   WHERE s.active=1
   ORDER BY CASE WHEN st.last_error IS NOT NULL THEN 0 WHEN s.last_checked_at IS NULL THEN 1 ELSE 2 END,
            s.source_type,s.name
  `).all<{
   id:string;name:string;url:string;source_type:string;
   last_successful_check:string|null;last_attempt_at:string|null;last_error:string|null
  }>();
  const items=result.results;
  const failed=items.filter(x=>Boolean(x.last_error)).length;
  const neverChecked=items.filter(x=>!x.last_successful_check&&!x.last_error).length;
  return Response.json({
   summary:{total:items.length,failed,healthy:items.length-failed-neverChecked,neverChecked},
   items
  });
 }catch{
  return jsonError("Could not read source health. Check that all collector migrations are applied.",503);
 }
}
