/* ════════════════════════════════════════
   CURSOR
════════════════════════════════════════ */
const cursorEl = document.getElementById('cursor');
const dotEl    = document.getElementById('cursor-dot');
let mx=-200,my=-200,cx=-200,cy=-200;
document.addEventListener('mousemove',e=>{
  mx=e.clientX; my=e.clientY;
  dotEl.style.left=mx+'px'; dotEl.style.top=my+'px';
});
(function raf(){
  cx+=(mx-cx)*0.12; cy+=(my-cy)*0.12;
  cursorEl.style.left=cx+'px'; cursorEl.style.top=cy+'px';
  requestAnimationFrame(raf);
})();
document.querySelectorAll('a,button,[role="button"]').forEach(el=>{
  el.addEventListener('mouseenter',()=>cursorEl.classList.add('hover'));
  el.addEventListener('mouseleave',()=>cursorEl.classList.remove('hover'));
});

/* ════════════════════════════════════════
   HERO CANVAS — 3D-style particle field
   Mimics Scene3D: rotating particle cloud
   + two floating distorted orbs (CSS-side)
════════════════════════════════════════ */
(function initParticles(){
  const canvas=document.getElementById('hero-canvas');
  const ctx=canvas.getContext('2d');
  let W,H,particles=[];
  const COUNT=1800;

  function resize(){ W=canvas.width=canvas.offsetWidth; H=canvas.height=canvas.offsetHeight; }
  resize(); window.addEventListener('resize',resize);

  // Generate particles in a sphere-ish volume
  for(let i=0;i<COUNT;i++){
    const theta=Math.random()*Math.PI*2;
    const phi=Math.acos(2*Math.random()-1);
    const r=120+Math.random()*320;
    particles.push({
      ox: Math.sin(phi)*Math.cos(theta)*r,
      oy: Math.sin(phi)*Math.sin(theta)*r,
      oz: Math.cos(phi)*r,
      size: 0.6+Math.random()*1.2,
      alpha: 0.25+Math.random()*0.5
    });
  }

  let rotY=0,rotX=0;
  function draw(t){
    ctx.clearRect(0,0,W,H);
    rotY=t*0.00004;
    rotX=t*0.000015;
    const cosY=Math.cos(rotY),sinY=Math.sin(rotY);
    const cosX=Math.cos(rotX),sinX=Math.sin(rotX);
    const cx2=W/2,cy2=H/2;
    // sort by z for depth
    const projected=particles.map(p=>{
      // rotate Y
      const x1=p.ox*cosY - p.oz*sinY;
      const z1=p.ox*sinY + p.oz*cosY;
      // rotate X
      const y1=p.oy*cosX - z1*sinX;
      const z2=p.oy*sinX + z1*cosX;
      const fov=600;
      const scale=fov/(fov+z2+400);
      return { sx:cx2+x1*scale, sy:cy2+y1*scale, scale, size:p.size, alpha:p.alpha, z:z2 };
    });
    projected.sort((a,b)=>a.z-b.z);
    projected.forEach(p=>{
      const depth=(p.z+440)/880; // 0..1
      const r=Math.round(79+depth*100);
      const g=Math.round(139+depth*60);
      const b2=252;
      ctx.beginPath();
      ctx.arc(p.sx,p.sy,p.size*p.scale,0,Math.PI*2);
      ctx.fillStyle=`rgba(${r},${g},${b2},${p.alpha*(0.4+depth*0.6)})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

/* ════════════════════════════════════════
   TYPEWRITER
════════════════════════════════════════ */
const ROLES=["Product Specialist","Data Analyst","Python Developer","Full-Stack Builder"];
let rIdx=0,txt='',deleting=false;
const tw=document.getElementById('typewriter');
function type(){
  const word=ROLES[rIdx];
  const speed=deleting?40:90;
  if(!deleting){
    txt=word.slice(0,txt.length+1);
    tw.textContent=txt;
    if(txt===word){ setTimeout(()=>{deleting=true;},1400); setTimeout(type,speed+1400); return; }
  } else {
    txt=word.slice(0,txt.length-1);
    tw.textContent=txt;
    if(txt===''){ deleting=false; rIdx=(rIdx+1)%ROLES.length; }
  }
  setTimeout(type,speed);
}
type();

/* ════════════════════════════════════════
   TILT CARD (About photo card)
════════════════════════════════════════ */
const tiltCard=document.getElementById('tilt-card');
tiltCard.addEventListener('mousemove',e=>{
  const r=tiltCard.getBoundingClientRect();
  const x=(e.clientX-r.left)/r.width-0.5;
  const y=(e.clientY-r.top)/r.height-0.5;
  tiltCard.style.transform=`perspective(900px) rotateX(${-y*10}deg) rotateY(${x*12}deg) translateZ(0)`;
});
tiltCard.addEventListener('mouseleave',()=>{
  tiltCard.style.transform='perspective(900px) rotateX(0) rotateY(0)';
});

/* ════════════════════════════════════════
   SKILLS
════════════════════════════════════════ */
const skills=[
  {name:"Product Support & Client Success",value:90},
  {name:"Requirement Gathering & User Stories",value:85},
  {name:"Issue Triage & SLA Management",value:88},
  {name:"Stakeholder Communication",value:87},
  {name:"Agile / Scrum Workflows",value:80},
  {name:"Python (Pandas, NumPy, scikit-learn)",value:88},
  {name:"SQL (MySQL, Oracle, MSSQL)",value:90},
  {name:"Power BI / Tableau",value:82},
  {name:"Flask / Django / Node.js",value:78},
  {name:"Excel & MIS Reporting",value:92},
  {name:"Git & GitHub",value:85},
  {name:"Troubleshooting",value:88},
];
const sg=document.getElementById('skills-grid');
skills.forEach(s=>{
  sg.innerHTML+=`<div class="skill-row">
    <div class="skill-meta"><span>${s.name}</span><span class="skill-pct">${s.value}%</span></div>
    <div class="skill-track"><div class="skill-bar" data-pct="${s.value}"></div></div>
  </div>`;
});

/* ════════════════════════════════════════
   EXPERIENCE
════════════════════════════════════════ */
const roles=[
  {title:"Product Specialist",org:"Linways Technologies Pvt. Ltd.",when:"Jan 2026 — Present",place:"Bengaluru",
   points:["Primary point of contact for enterprise platform users — triaging and resolving technical issues with zero SLA breach.","Review system data to flag discrepancies and coordinate fixes with product & engineering teams.","Translate stakeholder requirements into platform capabilities, bridging clients and the engineering team."]},
  {title:"Billing & Records Assistant",org:"Aishu Enterprises",when:"Jun 2025 — Dec 2025",place:"Bengaluru",
   points:["Maintained sales, purchase, and inventory data in Excel with 100% data integrity.","Delivered weekly and monthly MIS reports on time, every time.","Spotted stock anomalies early and escalated with structured documentation."]},
  {title:"Python Intern",org:"Upskills Academy",when:"Jan 2025 — Mar 2025",place:"Online",
   points:["Built a production-ready quiz platform with auth, randomized questions, and automated scoring.","Optimized SQL schema and queries; performed end-to-end QA testing."]},
  {title:"Data Science with Python Intern",org:"DevSkillshub",when:"Jul 2024 — Sep 2024",place:"Online",
   points:["Ran end-to-end workflows: cleaning, preprocessing, anomaly detection, and EDA on real datasets.","Built Power BI and Python dashboards for stakeholder-ready insights."]},
];
const ew=document.getElementById('exp-wrap');
roles.forEach((r,i)=>{
  const titleBlock=`<div class="exp-title-block ${i%2===0?'reveal-left':'reveal-right'}">
    <div class="exp-when">${r.when.toUpperCase()}</div>
    <div class="exp-title">${r.title}</div>
    <div class="exp-org">${r.org} · ${r.place}</div>
  </div>`;
  const descBlock=`<div class="exp-desc-block ${i%2===0?'reveal-right':'reveal-left'}">
    <div class="exp-card glass-strong">
      <ul>${r.points.map(p=>`<li>${p}</li>`).join('')}</ul>
    </div>
  </div>`;
  ew.innerHTML+=`<div class="exp-item">
    <div class="exp-dot"></div>
    ${i%2===0?titleBlock+descBlock:descBlock+titleBlock}
  </div>`;
});

/* ════════════════════════════════════════
   PROJECTS
   Image as background tile, project name
   overlaid on top. Hover reveals full info
   + Visit Project button.
════════════════════════════════════════ */
const projects=[
  {
    title:"Quiz Platform",
    tagline:"Online Assessment System",
    grad:"proj-grad1",
    image:"asset/projects/quiz.jpg",   // place your image here
    desc:"Full-featured data-driven assessment platform with user auth, randomized question generation, automated scoring, and SQL-optimized data retrieval. Performed end-to-end QA testing.",
    tools:["Flask","MySQL","Python","HTML","CSS","JS"],
    link:"https://ajin-2004.github.io/quiz-app/",
    repo:"#"
  },
  {
    title:"Kairos'25",
    tagline:"College Fest Web Application",
    grad:"proj-grad2",
    image:"asset/projects/Kairos.jpg",        // place your image here
    desc:"Real-time full-stack web application with event scheduling, live data management, and streamlined user registration. Built cross-functionally under a tight deadline.",
    tools:["React.js","Node.js","Express","MongoDB"],
    link:"https://kairos25.onrender.com/",
    repo:"#"
  },
];
const pg=document.getElementById('projects-grid');
projects.forEach((p,i)=>{
  pg.innerHTML+=`
  <div class="proj-card reveal" style="transition-delay:${i*0.12}s">
    <!-- Background image -->
    <img class="proj-img" src="${p.image}" alt="${p.title}" onerror="this.style.display='none'">
    <!-- Gradient fallback always behind -->
    <div class="proj-bg-grad ${p.grad}"></div>
    <!-- Persistent vignette so title is readable at rest -->
    <div class="proj-vignette"></div>
    <!-- Always-visible title on top of image -->
    <div class="proj-info">
      <div class="proj-tagline">${p.tagline}</div>
      <div class="proj-title">${p.title}</div>
    </div>
    <!-- Hover overlay: dims image, shows details + visit button -->
    <div class="proj-hover">
      <div class="proj-hover-tagline">${p.tagline}</div>
      <div class="proj-hover-title">${p.title}</div>
      <p class="proj-desc">${p.desc}</p>
      <div class="proj-tools">${p.tools.map(t=>`<span class="tool-tag">${t}</span>`).join('')}</div>
      <div class="proj-links-row">
        <a href="${p.link}" class="proj-visit">Visit Project <span class="proj-visit-arrow">↗</span></a>
        <a href="${p.repo}" class="proj-code">⌥ Code</a>
      </div>
    </div>
  </div>`;
});

/* ════════════════════════════════════════
   CERTIFICATIONS
════════════════════════════════════════ */
const certs=[
  {name:"PyNum AI Developer Certification",org:"Python Academy",note:"NumPy, Pandas, data analysis pipelines",icon:"🏅"},
  {name:"Data Science Job Simulation",org:"British Airways",note:"Data cleaning, EDA, discrepancy handling, business insights",icon:"✈"},
  {name:"Data Visualization Job Simulation",org:"Tata",note:"Power BI, business scenarios, stakeholder communication",icon:"📊"},
  {name:"Project Manager Job Simulation",org:"Siemens",note:"KPI tracking, MIS reporting, cross-functional delivery",icon:"⚙"},
];
const cg=document.getElementById('certs-grid');
certs.forEach((c,i)=>{
  cg.innerHTML+=`<div class="cert-card glass-strong reveal" style="transition-delay:${i*0.08}s">
    <div class="cert-icon">${c.icon}</div>
    <div>
      <div class="cert-name">${c.name}</div>
      <div class="cert-org">${c.org}</div>
      <div class="cert-note">${c.note}</div>
    </div>
  </div>`;
});

/* ════════════════════════════════════════
   CONTACT FORM
════════════════════════════════════════ */
document.getElementById('contact-form').addEventListener('submit',function(e){
  e.preventDefault();
  this.style.display='none';
  document.getElementById('sent-state').style.display='block';
});

/* ════════════════════════════════════════
   FOOTER YEAR
════════════════════════════════════════ */
document.getElementById('footer-year').textContent=new Date().getFullYear();

/* ════════════════════════════════════════
   INTERSECTION OBSERVER — scroll reveals
   + skill bar animations
════════════════════════════════════════ */
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('revealed');
      entry.target.querySelectorAll && entry.target.querySelectorAll('.skill-bar').forEach(bar=>{
        bar.style.width=bar.dataset.pct+'%';
      });
    }
  });
},{threshold:0.12,rootMargin:'-40px'});

// Observe after JS renders dynamic content
setTimeout(()=>{
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el=>observer.observe(el));
  // Extra observer for skills panel specifically
  const sp=document.querySelector('.skills-panel');
  if(sp){ new IntersectionObserver(es=>{ if(es[0].isIntersecting) document.querySelectorAll('.skill-bar').forEach(b=>b.style.width=b.dataset.pct+'%'); },{threshold:0.2}).observe(sp); }
},100);
