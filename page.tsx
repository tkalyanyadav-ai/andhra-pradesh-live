import { Search, Bell, ArrowUpRight, Landmark, FileText, ShieldCheck, MapPinned, BriefcaseBusiness, Building2, Newspaper, ChevronRight, Clock3, ExternalLink, Menu } from "lucide-react";

const nav = ["Home", "Amaravati", "IAS Transfers", "IPS Transfers", "Districts", "Government Orders", "News", "Schemes", "Recruitment", "Departments"];
const quick = [
  { label: "Government Orders", detail: "Official GO search & archive", icon: FileText, href: "#orders" },
  { label: "IAS & IPS Postings", detail: "Transfers, appointments & history", icon: ShieldCheck, href: "#officers" },
  { label: "District Directory", detail: "Updates across all districts", icon: MapPinned, href: "#districts" },
  { label: "Amaravati Projects", detail: "Capital development tracker", icon: Landmark, href: "#amaravati" },
];
const sections = [
  { title: "Administration", links: ["IAS transfers & postings", "IPS transfers & postings", "District Collectors", "District SPs"] },
  { title: "Government", links: ["Government Orders", "Department circulars", "Schemes & welfare", "Gazette notifications"] },
  { title: "Public information", links: ["Recruitment & jobs", "District notifications", "Tenders & contracts", "Official directories"] },
];
export default function Home() {
  return <main>
    <div className="topline"><div className="wrap topline-inner"><span>ANDHRA PRADESH INFORMATION NETWORK</span><span className="top-right">Official sources first <i/> English&nbsp; | &nbsp;తెలుగు</span></div></div>
    <header className="header"><div className="wrap header-inner">
      <a className="brand" href="#"><span className="brand-mark"><Landmark size={25}/></span><span><b>ANDHRA PRADESH <em>LIVE</em></b><small>Your State. Your Government. Your Latest Updates.</small></span></a>
      <div className="header-actions"><button className="icon-btn" aria-label="Notifications"><Bell size={19}/></button><button className="menu-btn" aria-label="Open menu"><Menu size={21}/></button></div>
    </div></header>
    <nav className="nav"><div className="wrap nav-inner">{nav.map((n,i)=><a className={i===0?"active":""} key={n} href={i===0?"#":`#${n.toLowerCase().replaceAll(" ","-")}`}>{n}</a>)}</div></nav>
    <section className="hero"><div className="wrap hero-grid"><div className="hero-copy">
      <div className="eyebrow"><span/> THE ANDHRA PRADESH INFORMATION PORTAL</div>
      <h1>Every Update. Every District.<br/><span>Every Development.</span></h1>
      <p>One trusted destination for Andhra Pradesh government decisions, administration, Amaravati development and news from all 26 districts.</p>
      <div className="search"><Search size={20}/><input placeholder="Search news, GO numbers, officers, districts..." aria-label="Search portal"/><button>Search</button></div>
      <div className="hero-meta"><span><ShieldCheck size={15}/> Official sources prioritized</span><span><Clock3 size={15}/> Source timestamps displayed</span></div>
    </div><div className="hero-panel">
      <div className="panel-top"><span>EXPLORE THE PORTAL</span><ArrowUpRight size={18}/></div>
      {quick.map((q,i)=><a className="quick-link" href={q.href} key={q.label}><span className="quick-icon"><q.icon size={20}/></span><span><b>{q.label}</b><small>{q.detail}</small></span><ChevronRight size={17}/></a>)}
      <div className="panel-foot">Built around traceable sources and transparent verification.</div>
    </div></div></section>
    <section className="wrap trust-strip"><div><b>Accuracy before speed</b><span>Every update should be traceable</span></div><div><b>Official documents</b><span>Original orders and notices linked</span></div><div><b>Statewide coverage</b><span>District and department structure</span></div></section>
    <section className="wrap content">
      <div className="section-heading"><div><div className="eyebrow">PORTAL DIRECTORY</div><h2>Explore Andhra Pradesh</h2><p>Choose a subject to find the information you need.</p></div><a className="text-link" href="#directory">View all sections <ArrowUpRight size={16}/></a></div>
      <div className="directory-grid" id="directory">{sections.map((s,i)=><article className="directory-card" key={s.title}><div className="dir-number">0{i+1}</div><h3>{s.title}</h3>{s.links.map(l=><a key={l} href="#">{l}<ChevronRight size={15}/></a>)}</article>)}</div>
      <div className="section-heading feature-heading" id="amaravati"><div><div className="eyebrow">CAPITAL REGION</div><h2>Amaravati development</h2><p>Follow projects, planning, infrastructure and official announcements.</p></div><a className="text-link" href="#">Explore Amaravati <ArrowUpRight size={16}/></a></div>
      <div className="capital-card"><div className="capital-visual"><div className="capital-label"><Landmark size={17}/> CAPITAL REGION DEVELOPMENT</div><div className="capital-title">A connected, planned<br/>capital for Andhra Pradesh.</div><span>Project updates will appear here only after source verification.</span></div><div className="capital-info"><div><small>TRACK</small><b>Infrastructure & connectivity</b></div><div><small>TRACK</small><b>Government buildings</b></div><div><small>TRACK</small><b>APCRDA plans & notifications</b></div><a href="https://crda.ap.gov.in/" target="_blank" rel="noreferrer">Visit official APCRDA website <ExternalLink size={14}/></a></div></div>
      <div className="section-heading feature-heading" id="orders"><div><div className="eyebrow">DOCUMENT TRACKER</div><h2>Government Orders</h2><p>Search official orders by number, department, date or subject.</p></div><a className="text-link" href="https://goir.ap.gov.in/" target="_blank" rel="noreferrer">Open official GOIR <ArrowUpRight size={16}/></a></div>
      <div className="go-search"><div className="go-icon"><FileText size={23}/></div><div><b>Looking for a Government Order?</b><span>Use the official GOIR portal for the authoritative document record.</span></div><a href="https://goir.ap.gov.in/" target="_blank" rel="noreferrer">Search GOIR <ArrowUpRight size={16}/></a></div>
      <div className="section-heading feature-heading" id="districts"><div><div className="eyebrow">STATEWIDE COVERAGE</div><h2>District information</h2><p>District pages will surface verified local administration and public notices.</p></div><a className="text-link" href="https://www.india.gov.in/" target="_blank" rel="noreferrer">Government directory <ArrowUpRight size={16}/></a></div>
      <div className="district-note"><Building2 size={22}/><div><b>District directory framework</b><span>District names, boundaries and administrative metadata must be synchronized against current official government records before publication.</span></div></div>
      <div className="section-heading feature-heading" id="officers"><div><div className="eyebrow">ADMINISTRATIVE CHANGES</div><h2>IAS & IPS postings</h2><p>Track posting changes with order references and chronological history.</p></div></div>
      <div className="officer-grid"><div className="officer-card"><ShieldCheck size={22}/><b>IAS officers</b><span>Collectors, Secretaries, Commissioners and other assignments.</span></div><div className="officer-card"><BriefcaseBusiness size={22}/><b>IPS officers</b><span>DGP, commissionerates, range and district police postings.</span></div><div className="officer-card"><Newspaper size={22}/><b>News & notifications</b><span>Developing reports separated from officially confirmed changes.</span></div></div>
      <div className="notice"><ShieldCheck size={18}/><p><b>Transparency note:</b> This initial build contains no fabricated live headlines, GO numbers, officer transfers or project statuses. Live feeds will appear only after source connectors and editorial verification are configured.</p></div>
    </section>
    <footer><div className="wrap footer-inner"><a className="brand footer-brand" href="#"><span className="brand-mark"><Landmark size={22}/></span><span><b>ANDHRA PRADESH <em>LIVE</em></b><small>Every Update. Every District. Every Development.</small></span></a><div>Independent information portal · Official sources linked wherever available</div><small>© {new Date().getFullYear()} Andhra Pradesh Live</small></div></footer>
  </main>;
}