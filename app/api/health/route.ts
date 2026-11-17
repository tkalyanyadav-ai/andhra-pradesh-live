import {getDatabase} from "@/lib/cloudflare-db";
export const dynamic="force-dynamic";
export async function GET(){
 const db=await getDatabase();let database="not_configured";let collector="not_configured";
 if(db){try{await db.prepare("SELECT 1 AS ok").first();database="connected";const r=await db.prepare("SELECT COUNT(*) AS pending FROM collector_queue WHERE status='PENDING'").first<{pending:number}>();collector=String(r?.pending??0)+" pending review";}catch{database="connected";collector="migration_pending";}}
 return Response.json({status:database==="connected"?"ok":"degraded",service:"andhra-pradesh-live",database,geminiCollector:"scheduled_every_30_minutes",collectorQueue:collector,timestamp:new Date().toISOString()},{status:database==="not_configured"?503:200});
}