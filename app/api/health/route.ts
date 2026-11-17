import {getDatabase} from "@/lib/cloudflare-db";
export const dynamic="force-dynamic";
export async function GET(){
 const db=await getDatabase();
 if(!db)return Response.json({status:"degraded",service:"andhra-pradesh-live",database:"not_configured",timestamp:new Date().toISOString()},{status:503});
 try{
  await db.prepare("SELECT 1 AS ok").first();
  const queue=await db.prepare("SELECT COUNT(*) AS pending FROM collector_queue WHERE status='PENDING'").first<{pending:number}>();
  const sources=await db.prepare("SELECT COUNT(*) AS total, SUM(CASE WHEN source_type='OFFICIAL' THEN 1 ELSE 0 END) AS official, SUM(CASE WHEN source_type='NEWS' THEN 1 ELSE 0 END) AS news, SUM(CASE WHEN last_checked_at IS NOT NULL THEN 1 ELSE 0 END) AS checked FROM sources WHERE active=1").first<{total:number;official:number;news:number;checked:number}>();
  const state=await db.prepare("SELECT MAX(last_checked_at) AS last_checked, SUM(CASE WHEN last_error IS NOT NULL THEN 1 ELSE 0 END) AS errors FROM collector_source_state").first<{last_checked:string|null;errors:number}>();
  return Response.json({status:"ok",service:"andhra-pradesh-live",database:"connected",collector:{configured:true,geminiConfigured:Boolean(process.env.GEMINI_API_KEY),schedule:"*/30 * * * *",sources:sources?.total??0,officialSources:sources?.official??0,newsFeeds:sources?.news??0,
   sportsFeeds:(await db.prepare(`SELECT COUNT(*) AS n FROM sources WHERE active=1 AND (id LIKE 'src-rss-sports-%' OR id LIKE 'src-rss-mykhel-%' OR id LIKE 'src-rss-hindu-sport%' OR id LIKE 'src-rss-hindu-cricket%' OR id LIKE 'src-rss-hindu-football%' OR id LIKE 'src-rss-hindu-tennis%' OR id LIKE 'src-rss-hindu-hockey%' OR id LIKE 'src-rss-hindu-athletics%' OR id LIKE 'src-rss-hindu-motorsport%' OR id LIKE 'src-rss-hindu-other-sports%' OR id LIKE 'src-rss-google-ap-sports%' OR id LIKE 'src-rss-google-ap-cricket%' OR id LIKE 'src-rss-google-telugu-sports%')`).first<{n:number}>())?.n??0,
   entertainmentFeeds:(await db.prepare(`SELECT COUNT(*) AS n FROM sources WHERE active=1 AND (id LIKE 'src-rss-entertainment-%' OR id LIKE 'src-rss-filmibeat-%' OR id LIKE 'src-rss-hindu-entertainment%' OR id LIKE 'src-rss-hindu-movies%' OR id LIKE 'src-rss-hindu-reviews%' OR id LIKE 'src-rss-hindu-music%' OR id LIKE 'src-rss-google-tollywood%' OR id LIKE 'src-rss-google-telugu-movies%' OR id LIKE 'src-rss-google-telugu-ott%' OR id LIKE 'src-rss-google-indian-cinema%' OR id LIKE 'src-rss-google-music%')`).first<{n:number}>())?.n??0,
   everChecked:sources?.checked??0,pendingReview:queue?.pending??0,lastChecked:state?.last_checked??null,sourceErrors:state?.errors??0},timestamp:new Date().toISOString()});
 }catch{
  return Response.json({status:"degraded",service:"andhra-pradesh-live",database:"connected",collector:"migration_or_query_error",timestamp:new Date().toISOString()},{status:503});
 }
}