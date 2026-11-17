"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {ArrowUpRight,Clock3,Newspaper,ShieldCheck} from "lucide-react";
type Article={id:string;title:string;summary:string;category:string;source_url:string;published_at:string;verification_status:string;district:string|null;source_name:string|null};
export default function LatestUpdates(){
 const [items,setItems]=useState<Article[]>([]);const [loading,setLoading]=useState(true);const [error,setError]=useState(false);
 useEffect(()=>{let active=true;fetch("/api/content/news?limit=6").then(r=>{if(!r.ok)throw new Error("News unavailable");return r.json()}).then(d=>{if(active)setItems((d.items??[]) as Article[])}).catch(()=>{if(active)setError(true)}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[]);
 return <section className="container latest-section" aria-labelledby="latest-heading">
  <div className="latest-heading"><div><div className="eyebrow">LATEST PUBLISHED UPDATES</div><h2 id="latest-heading">Latest updates from Andhra Pradesh</h2><p>Recent published stories with source links and verification labels.</p></div><Link href="/news">All news <ArrowUpRight size={15}/></Link></div>
  {loading?<div className="latest-empty"><Clock3 size={18}/> Loading the latest updates…</div>:error?<div className="latest-empty"><Newspaper size={18}/> Latest updates are temporarily unavailable. Please try again.</div>:items.length===0?<div className="latest-empty"><ShieldCheck size={19}/><span><b>No published updates yet</b><small>Newly collected reports appear here after editorial review and approval.</small></span><Link href="/admin">Editorial review <ArrowUpRight size={14}/></Link></div>:
   <div className="latest-grid">{items.map(item=><article className="latest-card" key={item.id}><div className="latest-meta"><span>{item.category}</span><small>{item.published_at||"Date not supplied"}</small></div><h3>{item.title}</h3><p>{item.summary}</p><div className="latest-footer"><span>{item.district||item.source_name||"Andhra Pradesh"}</span><span className={"status "+(item.verification_status==="CONFIRMED"?"status-confirmed":"status-developing")}>{(item.verification_status||"").replaceAll("_"," ")}</span></div><a href={item.source_url} target="_blank" rel="noreferrer">Read original report <ArrowUpRight size={13}/></a></article>)}</div>}
 </section>
}
