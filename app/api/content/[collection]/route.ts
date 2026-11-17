import {getDatabase} from "@/lib/cloudflare-db";
export const dynamic="force-dynamic";
const sql:Record<string,string>={
 news:"SELECT id,slug,title,title_te,summary,summary_te,category,source_url,published_at,verification_status,district_id FROM articles WHERE is_demo=0 ORDER BY published_at DESC LIMIT ?",
 "government-orders":"SELECT id,go_number,category,subject,summary,issue_date,pdf_url,source_url,verified FROM government_orders WHERE is_demo=0 ORDER BY issue_date DESC LIMIT ?",
 districts:"SELECT id,name,name_te,slug,official_url FROM districts WHERE active=1 ORDER BY name LIMIT ?",
 departments:"SELECT id,name,name_te,slug,official_url FROM departments ORDER BY name LIMIT ?",
 officers:"SELECT o.id,o.full_name,o.service,o.batch,p.designation,p.effective_from,p.effective_to,p.order_number,p.official_order_url,p.verified,d.name AS district,dep.name AS department FROM officers o LEFT JOIN officer_postings p ON p.officer_id=o.id LEFT JOIN districts d ON d.id=p.district_id LEFT JOIN departments dep ON dep.id=p.department_id ORDER BY o.service,o.full_name,p.effective_from DESC LIMIT ?",
 amaravati:"SELECT id,name,description,status,source_url,updated_at,verified FROM amaravati_projects ORDER BY updated_at DESC LIMIT ?",
 schemes:"SELECT id,name,name_te,description,eligibility,apply_url,source_url,updated_at,verified FROM schemes ORDER BY updated_at DESC LIMIT ?",
 recruitment:"SELECT id,title,organization,deadline,notification_url,apply_url,source_url,created_at FROM recruitment_notices ORDER BY created_at DESC LIMIT ?"
};
export async function GET(req:Request,{params}:{params:Promise<{collection:string}>}){const {collection}=await params;if(!sql[collection])return Response.json({error:"Unknown collection"},{status:404});const limit=Math.min(Math.max(Number(new URL(req.url).searchParams.get("limit")||30),1),100);const db=await getDatabase();if(!db)return Response.json({items:[],configured:false,message:"D1 database is not connected."});try{const r=await db.prepare(sql[collection]).bind(limit).all();return Response.json({items:r.results,configured:true})}catch{return Response.json({items:[],configured:false,message:"Apply the D1 migrations before publishing records."},{status:503})}}