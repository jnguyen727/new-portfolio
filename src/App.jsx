import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  FolderGit2,
  FileText,
  MonitorCog,
  Wrench,
  Gamepad2,
  Image as ImageIcon,
  Flag,
} from "lucide-react";

/*************************************************
 * Johnny Nguyen — Retro XP Portfolio (Full Website)
 *************************************************/

const RESUME = {
  name: "Johnny Nguyen",
  location: "West Lafayette, IN",
  email: "nguye875@purdue.edu",
  phone: "(260) 466-1147",
  links: { linkedin: "linkedin.com/in/jnguyen727", github: "github.com/jnguyen727" },
};

/******************* Visual FX *******************/
function CRTEffect(){
  return (
    <>
      <div className="pointer-events-none fixed inset-0 opacity-20" style={{backgroundImage:"repeating-linear-gradient(0deg, rgba(0,0,0,.35) 0, rgba(0,0,0,.35) 1px, transparent 3px, transparent 4px)"}}/>
      <div className="pointer-events-none fixed inset-0" style={{background:"radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(0,0,0,.35) 100%)"}}/>
    </>
  );
}
function Bliss(){
  return (
    <div className="fixed inset-0 -z-10" style={{background:"linear-gradient(#86c5ff 0%, #b8e4ff 52%, #9ae68f 52.2%, #66b24f 100%)"}}>
      <div className="absolute top-10 left-10 w-64 h-24 rounded-full bg-white/70 blur-md"/>
      <div className="absolute top-20 left-56 w-40 h-14 rounded-full bg-white/60 blur-md"/>
      <div className="absolute top-24 left-80 w-56 h-16 rounded-full bg-white/65 blur-md"/>
    </div>
  );
}
function RetroStyles(){
  return (
    <style>{`
      :root{ --retro-font: "MS Sans Serif","Chicago","Tahoma","Verdana",sans-serif; }
      .retro, .retro *{ font-family: var(--retro-font) !important; -webkit-font-smoothing: none; text-rendering: optimizeSpeed; image-rendering: pixelated; }
      .titlebar{ font-size:12px; letter-spacing:.2px; }
      .body{ }
      .xp-task-button{ box-shadow: inset 0 1px 0 #fff; }
    `}</style>
  );
}

/******************* Utils *******************/
const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
const rectsIntersect=(a,b)=>!(a.x+a.w<b.x||b.x+b.w<a.x||a.y+a.h<b.y||b.y+b.h<a.y);
const computeNextPos=(clientX,clientY,offset)=>({x:clientX-offset.x,y:clientY-offset.y});
function useZStack(base=60){ const [z,setZ]=useState(base); const bump=()=>setZ(v=>v+1); return [z,bump]; }

/******************* Window (updated) *******************/
function DraggableWindow({
  id,
  title,
  icon,
  children,
  onClose,
  onMinimize,
  zIndex,
  onFocus,
  initial,
  chrome = "xp",          // "xp" (default) or "none"
  dragHandleRef = null,   // external drag handle (e.g., Adobe red bar)
}) {
  const [pos, setPos] = useState(initial || { x: 120, y: 120 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const headerRef = useRef(null);

  const startDrag = (e, getRect) => {
    e.stopPropagation();
    const r = getRect();
    setDragging(true);
    setOffset({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging) return;
      requestAnimationFrame(() =>
        setPos({ x: e.clientX - offset.x, y: e.clientY - offset.y })
      );
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, offset]);

  // Bind external drag handle
  useEffect(() => {
    if (!dragHandleRef || !dragHandleRef.current) return;
    const el = dragHandleRef.current;
    const onDown = (e) => startDrag(e, () => el.getBoundingClientRect());
    el.addEventListener("mousedown", onDown);
    return () => el.removeEventListener("mousedown", onDown);
  }, [dragHandleRef]);

  return (
    <motion.div
      className="xp-window absolute select-none retro"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      style={{ position: "absolute", left: pos.x, top: pos.y, zIndex }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onFocus?.(id);
      }}
    >
      {/* chrome none: just render children */}
      {chrome === "none" ? (
        <div>{children}</div>
      ) : (
        <div className="shadow-xl" style={{ border: "2px solid #0a398a", borderRadius: 0 }}>
          <div
            ref={headerRef}
            className="titlebar flex items-center gap-2 px-3 py-1 text-white cursor-move"
            onMouseDown={(e) =>
              startDrag(e, () => headerRef.current.getBoundingClientRect())
            }
            style={{
              background:
                "linear-gradient(180deg,#245edc 0%,#3a72e8 50%,#245edc 100%)",
            }}
          >
            <div className="bg-white text-black w-4 h-4 grid place-items-center text-[10px] border border-gray-500">
              {icon || "★"}
            </div>
            <div className="font-bold drop-shadow-[0_1px_0_rgba(0,0,0,.5)]">{title}</div>
            <div className="ml-auto flex items-center gap-1">
              <button
                className="w-6 h-6 text-black bg-[#dcdcdc] border border-[#8c8c8c]"
                title="Minimize"
                onClick={() => onMinimize?.(id)}
              >
                —
              </button>
              <button
                className="w-6 h-6 text-black bg-[#dcdcdc] border border-[#8c8c8c]"
                title="Close"
                onClick={() => onClose?.(id)}
              >
                ✕
              </button>
            </div>
          </div>
          <div className="body bg-[#ece9d8] p-4 min-w-[320px] w-[min(90vw,780px)] min-h-[180px] text-sm">
            {children}
          </div>
        </div>
      )}
    </motion.div>
  );
}


/******************* Desktop Icons & Taskbar *******************/
function DesktopIcon({ id, label, icon, selected, position, onOpen, onDrag, registerRef }){
  const iconRef=useRef(null);
  useEffect(()=>{ registerRef?.(id, iconRef.current); },[id]);
  const [dragging,setDragging]=useState(false);
  const [offset,setOffset]=useState({x:0,y:0});
  useEffect(()=>{
    const onMove=(e)=>{ if(!dragging) return; onDrag?.(id,{x:e.clientX-offset.x,y:e.clientY-offset.y}); };
    const onUp=()=>setDragging(false);
    window.addEventListener('mousemove',onMove); window.addEventListener('mouseup',onUp);
    return()=>{ window.removeEventListener('mousemove',onMove); window.removeEventListener('mouseup',onUp); };
  },[dragging,offset]);
  return (
    <div ref={iconRef} style={{position:'absolute', left:position.x, top:position.y, width:96}} onDoubleClick={onOpen}
         onMouseDownCapture={(e)=>{ if(e.button!==0) return; const r=iconRef.current.getBoundingClientRect(); setDragging(true); setOffset({x:e.clientX-r.left,y:e.clientY-r.top}); }}>
      <div className="flex flex-col items-center w-24">
        <div className={`w-12 h-12 grid place-items-center text-black text-xl shadow border border-gray-400 ${selected?'bg-[#316ac5] text-white':'bg-[#ece9d8]'}`}>{icon}</div>
        <span className={`mt-1 text-xs text-center px-1.5 py-0.5 retro ${selected?'bg-[#316ac5] text-white':'bg-black/50 text-white'}`}>{label}</span>
      </div>
    </div>
  );
}
function Taskbar({ tasks, activeId, onToggleTask, onStartClick }){
  const [now,setNow]=useState(new Date()); useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000); return()=>clearInterval(t);},[]);
  return (
    <div className="retro fixed bottom-0 left-0 right-0 h-10 flex items-center justify-between px-2" style={{background:"linear-gradient(180deg,#3a72e8 0%,#245edc 100%)",fontSize:13,color:'white'}}>
      <div className="flex items-center gap-2 overflow-x-auto pr-2">
        <button onClick={onStartClick} className="xp-task-button flex items-center gap-2 px-3 py-1.5 text-black bg-[#eaeaea] border border-[#9a9a9a] shadow font-bold shrink-0">
          <span className="bg-[#53c41a] w-3 h-3 rounded-sm"/> Start
        </button>
        {tasks.map(t=> (
          <button key={t.id} onClick={()=>onToggleTask(t.id)} className={`xp-task-button shrink-0 flex items-center gap-2 px-3 py-1.5 border border-[#9a9a9a] bg-[#eaeaea] text-black ${activeId===t.id && !t.minimized? 'brightness-95':''}`} title={t.title}>
            <span className="w-4 h-4 grid place-items-center bg-white border border-gray-400 text-[10px]">{t.icon}</span>
            <span className="whitespace-nowrap">{t.title}</span>
          </button>
        ))}
      </div>
      <div className="text-sm bg-black/30 px-2 py-0.5 rounded">{now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
    </div>
  );
}

/******************* App Content *******************/
function AboutContent(){
  return (
    <div className="space-y-3 text-sm">
      <p>
        Hey! I’m <b>{RESUME.name}</b> and I'm from Fort Wayne, Indiana. I’m currently <b>classifying RF signals</b> as an Undergraduate Researcher for <b>Raytheon</b> at Purdue. I love <b>embedded systems</b>, aerospace‑oriented software engineering, and coding for fun. Outside class, I’ve joined the <b>Purdue Space Program</b> to program real satellites, boxing club to practice boxing and the bodybuilding club since I love bodybuildling.
      </p>
      <p>
        Contact: <a className="underline" href={`mailto:${RESUME.email}`}>{RESUME.email}</a> · {RESUME.phone}. Links:
        <a className="underline ml-1" href={`https://${RESUME.links.linkedin}`} target="_blank" rel="noreferrer">LinkedIn</a>,
        <a className="underline ml-1" href={`https://${RESUME.links.github}`} target="_blank" rel="noreferrer">GitHub</a>.
      </p>
    </div>
  );
}
// ✨ add onSeeMore to the props
function ProjectsContent({ onOpenProject, onSeeMore }) {
  const cards = [
    { key:'campusconnect', title:'CampusConnect Socket Server (Java)', desc:'Multithreaded client–server with rooms, back-pressure & reconnection.', gif:'/lol.gif' },
    { key:'chess-analytics', title:'Big Data Chess Analytics (AWS)', desc:'EMR + HiveQL pipelines for openings, rating drift, tactic clusters.', gif:'/chess.gif' },
    { key:'cpp-sim', title:'NERV Missle Defense', desc:'A terminal missle defense simulator I made in C++. You are are NERV, and angels are trying to attack you. Thankfully, you have heatseeking missles to defeat them.', gif:'/cpp.gif' },
    { key:'rf-classifier', title:'Raytheon RF Signal Classifier (GPU)', desc:'Python prototypes from MATLAB datasets; GPU-accelerated classification for real-time RF.', gif:'/f16.gif' },
  ];

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-3">
        {cards.map((p) => (
          <button
            key={p.key}
            onClick={() => onOpenProject(p)}
            className="text-left bg-white/90 p-3 border border-[#bfbfbf] shadow hover:shadow-md"
          >
            <div className="font-semibold flex items-center gap-2">
              <FolderGit2 size={16} className="text-[#245edc]" />
              {p.title}
            </div>
            <div className="text-sm mt-1 opacity-80">{p.desc}</div>
            <div className="mt-2 text-xs text-[#245edc] flex items-center gap-1">
              <ImageIcon size={14} /> Click to preview GIF
            </div>
          </button>
        ))}
      </div>

      {/* 👇 Friendly “see more” note */}
      <div className="mt-3 text-xs flex items-center gap-2">
        <span className="opacity-80">
          Want to see more projects? Check my résumé for the full list
          <span className="opacity-70"> (if you want to see more of the actual projects, look on my resume lol)</span>.
        </span>
        <button
          onClick={onSeeMore}
          className="px-2 py-1 border border-[#8c8c8c] bg-[#dcdcdc] hover:brightness-95"
        >
          Open Résumé
        </button>
      </div>
    </div>
  );
}

function ProjectViewer({ project }){ if(!project) return null; return (
  <div className="space-y-2">
    <div className="font-semibold text-[15px]">{project.title}</div>
    <div className="text-sm opacity-80">{project.desc}</div>
    <div className="border border-[#9a9a9a] bg-white/90 grid place-items-center">
      <img src={project.gif} alt={`${project.title} demo`} className="max-h-[360px] w-auto" onError={(e)=>{ e.currentTarget.outerHTML='<div class="p-4 text-center text-sm">Upload a GIF to '+project.gif+' to see the preview.</div>'; }}/>
    </div>
  </div>
);} 

/******************* Device Monitor *******************/
const computeMetrics=(t)=>{
  const cpu = 8 + Math.abs(Math.sin(t/17)) * 62;
  const mem = 12 + Math.abs(Math.cos(t/23)) * 70;
  const pwm = 900 + Math.round(Math.sin(t/9) * 100);
  const i2cList = t % 2 ? ["0x40","0x1D"] : ["0x40"];
  const loopHz = 50 + Math.round(Math.sin(t/13) * 10);
  return {cpu,mem,pwm,i2cList,loopHz};
};
function DeviceMonitorContent(){
  const [tick,setTick]=useState(0); const metrics=useMemo(()=>computeMetrics(tick),[tick]);
  useEffect(()=>{const id=setInterval(()=>setTick(t=>t+1),120); return()=>clearInterval(id);},[]);
  const Bar=({v})=> (<div className="h-2 bg-[#d9e5ff] border border-[#aec4ff] overflow-hidden"><div className="h-full" style={{background:"linear-gradient(180deg,#2a73f2,#0a47b8)", width:`${clamp(v,0,100)}%`}}/></div>);
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-5 gap-3 text-sm items-center">
        <div className="col-span-1 text-right pr-2">CPU</div><div className="col-span-4"><Bar v={metrics.cpu}/></div>
        <div className="col-span-1 text-right pr-2">MEM</div><div className="col-span-4"><Bar v={metrics.mem}/></div>
        <div className="col-span-1 text-right pr-2">PWM</div><div className="col-span-4 text-sm">{metrics.pwm} µs (servo pulse)</div>
        <div className="col-span-1 text-right pr-2">I²C</div><div className="col-span-4 text-sm">{metrics.i2cList.join(', ')}</div>
        <div className="col-span-1 text-right pr-2">Loop</div><div className="col-span-4 text-sm">{metrics.loopHz} Hz (steady_clock)</div>
      </div>
      <div className="text-[11px] opacity-70">Simulated metrics. Hook up WebSerial/WebUSB for live telemetry.</div>
    </div>
  );
}

/******************* Games *******************/
function SnakeGame(){
  const SIZE=16, W=20, H=16; const [tick,setTick]=useState(0); const [dir,setDir]=useState({x:1,y:0}); const [snake,setSnake]=useState([{x:3,y:8}]); const [food,setFood]=useState({x:12,y:8}); const [alive,setAlive]=useState(true);
  useEffect(()=>{const id=setInterval(()=>setTick(t=>t+1),120); return()=>clearInterval(id);},[]);
  useEffect(()=>{ if(!alive) return; const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y}; if(head.x<0||head.y<0||head.x>=W||head.y>=H|| snake.some(s=>s.x===head.x&&s.y===head.y)){ setAlive(false); return; } const next=[head,...snake]; if(head.x===food.x&&head.y===food.y){ setFood({x:(Math.random()*W)|0,y:(Math.random()*H)|0}); } else next.pop(); setSnake(next); },[tick]);
  useEffect(()=>{ const onKey=(e)=>{ if(e.key==='ArrowUp'&&dir.y!==1) setDir({x:0,y:-1}); if(e.key==='ArrowDown'&&dir.y!==-1) setDir({x:0,y:1}); if(e.key==='ArrowLeft'&&dir.x!==1) setDir({x:-1,y:0}); if(e.key==='ArrowRight'&&dir.x!==-1) setDir({x:1,y:0}); }; window.addEventListener('keydown',onKey); return()=>window.removeEventListener('keydown',onKey); },[dir]);
  return (
    <div className="inline-block bg-black p-2">
      <div style={{width:W*SIZE,height:H*SIZE,position:'relative'}}>
        <div style={{position:'absolute',left:food.x*SIZE,top:food.y*SIZE,width:SIZE,height:SIZE,background:'#53c41a'}}/>
        {snake.map((s,i)=> (<div key={i} style={{position:'absolute',left:s.x*SIZE,top:s.y*SIZE,width:SIZE,height:SIZE,background:i===0?'#3a72e8':'#5fa1ff'}}/>))}
      </div>
      {!alive && <div className="text-white text-xs mt-2">Game Over — press any arrow key to restart</div>}
    </div>
  );
}
function _createMinesGrid(cols,rows,mines){ const total=cols*rows; const cells=Array.from({length:total},()=>({mine:false,n:0,open:false,flag:false})); let placed=0; const maxM=Math.max(0,Math.min(mines,total-1)); while(placed<maxM){ const i=(Math.random()*total)|0; if(!cells[i].mine){ cells[i].mine=true; placed++; } } const idx=(x,y)=>y*cols+x; const inb=(x,y)=>x>=0&&y>=0&&x<cols&&y<rows; for(let y=0;y<rows;y++) for(let x=0;x<cols;x++){ if(cells[idx(x,y)].mine) continue; let c=0; for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){ if(!dx&&!dy) continue; const nx=x+dx,ny=y+dy; if(inb(nx,ny)&&cells[idx(nx,ny)].mine) c++; } cells[idx(x,y)].n=c; } return cells; }
function _floodOpen(x,y,cells,cols,rows){ const idx=(x,y)=>y*cols+x; const inb=(x,y)=>x>=0&&y>=0&&x<cols&&y<rows; const st=[[x,y]]; while(st.length){ const [cx,cy]=st.pop(); const i=idx(cx,cy); const c=cells[i]; if(c.open||c.flag) continue; c.open=true; if(!c.mine && c.n===0){ for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){ if(!dx&&!dy) continue; const nx=cx+dx,ny=cy+dy; if(inb(nx,ny)) st.push([nx,ny]); } } } }
function Minesweeper({cols=10,rows=10,mines=12}){
  const [grid,setGrid]=useState(()=>_createMinesGrid(cols,rows,mines)); const [over,setOver]=useState(false); const [won,setWon]=useState(false);
  const idx=(x,y)=>y*cols+x;
  function handleOpen(x,y){ if(over||won) return; setGrid(prev=>{ const cells=prev.map(c=>({...c})); const i=idx(x,y); const cell=cells[i]; if(cell.flag||cell.open) return prev; if(cell.mine){ cell.open=true; setOver(true); return cells; } _floodOpen(x,y,cells,cols,rows); if(cells.every(c=>c.mine||c.open)) setWon(true); return cells; }); }
  function handleFlag(e,x,y){ e.preventDefault(); if(over||won) return; setGrid(prev=>{ const cells=prev.map(c=>({...c})); const i=idx(x,y); const cell=cells[i]; if(cell.open) return prev; cell.flag=!cell.flag; return cells; }); }
  function reset(){ setGrid(_createMinesGrid(cols,rows,mines)); setOver(false); setWon(false); }
  const colors=["#c0c0c0","#0000ff","#008200","#ff0000","#000084","#840000","#008284","#000000","#808080"];
  return (
    <div className="inline-block select-none">
      <div className="mb-2 flex items-center gap-2 text-sm"><button className="px-2 py-1 border border-[#8c8c8c] bg-[#dcdcdc]" onClick={reset}>New</button>{won&&<span className="text-green-700">You win!</span>}{over&&!won&&<span className="text-red-700">Boom!</span>}</div>
      <div style={{display:'grid',gridTemplateColumns:`repeat(${cols},22px)`,gridTemplateRows:`repeat(${rows},22px)`,border:'2px solid #0a398a',background:'#bdbdbd'}} onContextMenu={(e)=>e.preventDefault()}>
        {grid.map((cell,i)=>{ const x=i%cols, y=Math.floor(i/cols); const content=cell.flag? <Flag size={16}/> : (cell.open&&cell.mine? '💣' : (cell.open&&cell.n? cell.n : '')); const color=(cell.open&&!cell.mine&&cell.n)? colors[cell.n] : '#000'; return (
          <div key={i} onClick={()=>handleOpen(x,y)} onContextMenu={(e)=>handleFlag(e,x,y)} style={{width:22,height:22,display:'grid',placeItems:'center',fontWeight:'bold',fontSize:13,color}} className={`retro border ${cell.open? 'bg-[#e5e5e5] border-[#9a9a9a]':'bg-[#c0c0c0] border-[#7d7d7d] hover:brightness-95'}`}>{content}</div>
        ); })}
      </div>
    </div>
  );
}

/* ---------- Green ProgressBar ---------- */
function ProgressBar({ value = 0 }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="h-4 border border-[#808080] bg-[#f2f2f2]">
      <div
        className="h-full"
        style={{
          width: `${v}%`,
          background: "linear-gradient(180deg,#4caf50 0%,#2e7d32 100%)", // green gradient
        }}
      />
    </div>
  );
}


function RetroInstallerWindow({
  title,
  logoSrc = "/adobe.png",
  children,
  onClose,
  onMinimize,
  titlebarRef,                 // <— NEW
}) {
  return (
    <div
      className="retro border border-black"
      style={{
        boxShadow: "2px 2px #404040, -1px -1px #ffffff",
        backgroundColor: "#ece9d8",
      }}
    >
      {/* Red Adobe titlebar is the DRAG HANDLE */}
      <div
        ref={titlebarRef}       // <— hook drag here
        className="flex items-center px-2 py-1 text-white text-sm font-bold select-none"
        style={{ background: "linear-gradient(180deg,#b22222 0%,#8b0000 100%)" }}
      >
        <img
          src={logoSrc}
          alt="Adobe"
          className="w-4 h-4 mr-2 bg-white border border-gray-700"
        />
        <span className="drop-shadow-[0_1px_0_rgba(0,0,0,.5)]">{title}</span>
        <div className="ml-auto flex gap-1">
          <button className="w-6 h-6 bg-[#dcdcdc] border border-[#808080]" onClick={onMinimize} title="Minimize">
            _
          </button>
          <button className="w-6 h-6 bg-[#dcdcdc] border border-[#808080]" onClick={onClose} title="Close">
            X
          </button>
        </div>
      </div>
      <div className="p-4 text-sm" style={{ borderTop: "1px solid #fff" }}>
        {children}
      </div>
    </div>
  );
}



/* ---------- Resume Viewer ---------- */
export function ResumeViewer({ titlebarRef, onClose, onMinimize }) {
  const [zoom, setZoom] = useState(null);
  const [scan, setScan] = useState(true);
  const [nat, setNat] = useState({ w: 0, h: 0 });

  // installer state
  const [installing, setInstalling] = useState(true);
  const [progress, setProgress] = useState(0);

  const containerRef = useRef(null);
  const clampPct = (v) => Math.min(300, Math.max(20, v));
  const inc = (d) => setZoom((z) => clampPct((z ?? 100) + d));

  // animate progress for 4 seconds total
  useEffect(() => {
    if (!installing) return;
    let elapsed = 0;
    const duration = 4000; // 4 seconds
    const step = 100;      // update every 100ms

    const id = setInterval(() => {
      elapsed += step;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (elapsed >= duration) {
        clearInterval(id);
        setInstalling(false);
      }
    }, step);

    return () => clearInterval(id);
  }, [installing]);

  const scaledW = nat.w && zoom ? Math.round((nat.w * zoom) / 100) : undefined;

  return (
    <RetroInstallerWindow
      title="Adobe Reader XI"
      logoSrc="/adobe.png"
      titlebarRef={titlebarRef}
      onClose={onClose}
      onMinimize={onMinimize}
    >
      {/* Fake installer header */}
      {installing && (
        <div className="space-y-3 mb-3">
          <div className="font-semibold">Preparing installation…</div>
          <div className="text-xs opacity-80">
            This may take a few moments depending on your processor speed and configuration.
          </div>
          <div className="text-xs opacity-80">Extracting installation files…</div>
          <ProgressBar value={progress} />
        </div>
      )}

      {!installing && (
        <>
          {/* Controls */}
          <div className="flex items-center gap-2 text-xs mb-2">
            <button className="px-2 py-1 border border-[#8c8c8c] bg-[#dcdcdc]" onClick={() => inc(-10)}>−</button>
            <div className="px-2 py-1 border border-[#8c8c8c] bg-white">{zoom ?? "…"}%</div>
            <button className="px-2 py-1 border border-[#8c8c8c] bg-[#dcdcdc]" onClick={() => inc(+10)}>+</button>
            <button className="ml-2 px-2 py-1 border border-[#8c8c8c] bg-[#dcdcdc]" onClick={() => setZoom(100)} title="Reset to 100%">100%</button>
            <label className="ml-3 flex items-center gap-1">
              <input type="checkbox" checked={scan} onChange={(e)=>setScan(e.target.checked)} />
              Scanlines
            </label>
            <a className="ml-auto underline text-[#245edc]" href="/Johnny_Nguyen_Resume.png" target="_blank" rel="noreferrer">
              Open PDF in new tab
            </a>
          </div>

          {/* Viewer */}
          <div
            ref={containerRef}
            className="relative border border-[#9a9a9a] bg-black overflow-auto"
            style={{ height: "70vh" }}
          >
            <div className="min-w-full flex justify-center">
              <img
                src="/Johnny_Nguyen_Resume.png"
                alt="Resume"
                onLoad={(e) => {
                  const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
                  setNat({ w, h });
                  const cw = containerRef.current?.clientWidth || w;
                  const fit = clampPct(Math.round((cw / w) * 100));
                  setZoom(fit);
                }}
                className="block max-w-none flex-none"
                style={{
                  width: scaledW ? `${scaledW}px` : undefined,
                  height: "auto",
                  imageRendering: "pixelated",
                  filter: "contrast(108%) saturate(88%)",
                }}
              />
            </div>

            {/* CRT overlays */}
            {scan && (
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "repeating-linear-gradient(180deg, rgba(255,255,255,.06) 0, rgba(255,255,255,.06) 1px, transparent 3px, transparent 4px)",
                }}
              />
            )}
            <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 90px rgba(0,0,0,.65)" }} />
          </div>

          <div className="text-[11px] opacity-70 mt-2">
            Retro viewer (CRT/scanlines). If inline images are blocked, use the link above.
          </div>
        </>
      )}
    </RetroInstallerWindow>
  );
}




/******************* Main App *******************/
export default function RetroXPPortfolio(){
  const resumeBarRef = useRef(null);
  // z-order
  const [zSeed,bump]=useZStack(60); const [zMap,setZMap]=useState({});
  const focus=(id)=>{ bump(); setZMap(m=>({...m,[id]:zSeed+1})); };

  // windows open/minimize state
  const [open,setOpen]=useState({ about:true, projects:true, projectViewer:false, device:false, resume:false, snake:false, mines:false });
  const [minimized,setMinimized]=useState({});
  const openWindow=(id)=>{ setOpen(o=>({...o,[id]:true})); setMinimized(m=>({...m,[id]:false})); focus(id); };
  const closeWindow=(id)=>{ setOpen(o=>({...o,[id]:false})); setMinimized(m=>{ const c={...m}; delete c[id]; return c; }); };
  const minimizeWindow=(id)=> setMinimized(m=>({...m,[id]:true}));

  // start & ctx menus
  const [startOpen,setStartOpen]=useState(false);
  const [ctx,setCtx]=useState({show:false,x:0,y:0});
  const onContext=(e)=>{ e.preventDefault(); setCtx({show:true,x:e.clientX,y:e.clientY}); };
  const ctxAction=(k)=>{ if(k==='refresh'){ /* visual */ } if(k==='arrange'){ arrangeIcons(); } if(k==='about'){ openWindow('about'); } setCtx({show:false,x:0,y:0}); };

  // desktop icons with lasso selection
  const deskRef=useRef(null); const iconRefs=useRef({});
  const [iconPos,setIconPos]=useState({ about:{x:24,y:24}, projects:{x:24,y:120}, device:{x:24,y:216}, resume:{x:24,y:312}, snake:{x:24,y:408}, mines:{x:24,y:504} });
  const [selBox,setSelBox]=useState(null); const [selectedIds,setSelectedIds]=useState(new Set());
  const registerIconRef=(id,el)=>{ iconRefs.current[id]=el; };
  const beginSelection=(e)=>{
    const target=e.target; if(target && target.closest && target.closest('.xp-window')) return; if(e.button!==0) return; if(!deskRef.current) return;
    const rect=deskRef.current.getBoundingClientRect(); const start={x:e.clientX-rect.left,y:e.clientY-rect.top}; setSelBox({x:start.x,y:start.y,w:0,h:0});
    const onMove=(ev)=>{ const cur={x:ev.clientX-rect.left,y:ev.clientY-rect.top}; const box={x:Math.min(start.x,cur.x),y:Math.min(start.y,cur.y),w:Math.abs(cur.x-start.x),h:Math.abs(cur.y-start.y)}; setSelBox(box);
      const newSel=new Set(); Object.entries(iconRefs.current).forEach(([id,el])=>{ if(!el) return; const r=el.getBoundingClientRect(); const fr={x:r.left-rect.left,y:r.top-rect.top,w:r.width,h:r.height}; if(rectsIntersect(box,fr)) newSel.add(id); }); setSelectedIds(newSel);
    };
    const onUp=()=>{ setSelBox(null); window.removeEventListener('mousemove',onMove); window.removeEventListener('mouseup',onUp); };
    window.addEventListener('mousemove',onMove); window.addEventListener('mouseup',onUp);
  };
  function arrangeIcons(){ const keys=Object.keys(iconPos); const next={}; keys.forEach((id,idx)=>{ next[id]={x:24,y:24+idx*96}; }); setIconPos(next); }

  // tasks for taskbar
  const WINDOWS_META={
    about:{ title:'About Me — Properties', icon:<Cpu size={10}/> },
    projects:{ title:'Projects — Explorer', icon:<FolderGit2 size={10}/> },
    projectViewer:{ title:'Project Viewer', icon:<ImageIcon size={10}/> },
    device:{ title:'Device Monitor — Control Panel', icon:<Wrench size={10}/> },
    resume:{ title:'Resume — Viewer', icon:<FileText size={10}/> },
    snake:{ title:'Mini Game — Snake', icon:<Gamepad2 size={10}/> },
    mines:{ title:'Mini Game — Minesweeper', icon:<Flag size={10}/> },
  };
  const taskList=Object.keys(WINDOWS_META).filter((id)=>open[id]).map((id)=>({id,title:WINDOWS_META[id].title,icon:WINDOWS_META[id].icon,minimized:!!minimized[id]}));
  const activeId=Object.entries(zMap).sort((a,b)=>b[1]-a[1])[0]?.[0]||null;
  const onToggleTask=(id)=>{ if(!open[id]){ openWindow(id); return; } if(minimized[id]){ setMinimized(m=>({...m,[id]:false})); focus(id); } else { setMinimized(m=>({...m,[id]:true})); } };

  // projects → viewer
  const [activeProject,setActiveProject]=useState(null);

  return (
    <div className="retro relative min-h-[100vh] text-[15px]" onContextMenu={onContext}>
      <RetroStyles/>
      <Bliss/>
      <CRTEffect/>

      {/* Desktop surface */}
      <div ref={deskRef} className="relative min-h-[100vh]" onMouseDown={beginSelection}>
        {/* Desktop Icons */}
        <DesktopIcon id="about" label="About Me" icon={<FileText/>} selected={selectedIds.has('about')} position={iconPos.about} onOpen={()=>openWindow('about')} onDrag={(id,pos)=>setIconPos(p=>({...p,[id]:pos}))} registerRef={registerIconRef}/>
        <DesktopIcon id="projects" label="Projects" icon={<FolderGit2/>} selected={selectedIds.has('projects')} position={iconPos.projects} onOpen={()=>openWindow('projects')} onDrag={(id,pos)=>setIconPos(p=>({...p,[id]:pos}))} registerRef={registerIconRef}/>
        <DesktopIcon id="device" label="Device" icon={<MonitorCog/>} selected={selectedIds.has('device')} position={iconPos.device} onOpen={()=>openWindow('device')} onDrag={(id,pos)=>setIconPos(p=>({...p,[id]:pos}))} registerRef={registerIconRef}/>
        <DesktopIcon id="resume" label="Resume" icon={<FileText/>} selected={selectedIds.has('resume')} position={iconPos.resume} onOpen={()=>openWindow('resume')} onDrag={(id,pos)=>setIconPos(p=>({...p,[id]:pos}))} registerRef={registerIconRef}/>
        <DesktopIcon id="snake" label="Snake" icon={<Gamepad2/>} selected={selectedIds.has('snake')} position={iconPos.snake} onOpen={()=>openWindow('snake')} onDrag={(id,pos)=>setIconPos(p=>({...p,[id]:pos}))} registerRef={registerIconRef}/>
        <DesktopIcon id="mines" label="Minesweeper" icon={<Flag/>} selected={selectedIds.has('mines')} position={iconPos.mines} onOpen={()=>openWindow('mines')} onDrag={(id,pos)=>setIconPos(p=>({...p,[id]:pos}))} registerRef={registerIconRef}/>

        {/* Drag-selection rectangle */}
        {selBox && (
          <div style={{position:'absolute',left:selBox.x,top:selBox.y,width:selBox.w,height:selBox.h,border:'1px solid #2a8ae0',background:'rgba(65,140,255,0.25)',pointerEvents:'none'}}/>
        )}

        {/* Context menu */}
        <AnimatePresence>
          {ctx.show && (
            <motion.div initial={{opacity:0,scale:.98}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.98}} transition={{duration:.12}}
              className="fixed bg-[#f2f2f2] border border-[#9a9a9a] shadow-xl text-sm" style={{left:ctx.x, top:ctx.y, zIndex:9999}} onMouseDown={(e)=>e.stopPropagation()}>
              {[
                {k:'refresh',label:'Refresh'},
                {k:'arrange',label:'Arrange Icons'},
                {k:'about',label:'About Me'},
                {k:'props',label:'Desktop Properties'},
              ].map(it=> (
                <button key={it.k} onClick={()=>ctxAction(it.k)} className="w-48 text-left px-3 py-1 hover:bg-white">{it.label}</button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Windows */}
        <AnimatePresence>
          {open.about && !minimized['about'] && (
            <DraggableWindow id="about" title="About Me — Properties" icon={<Cpu size={10}/>} onClose={closeWindow} onMinimize={minimizeWindow} onFocus={focus} zIndex={zMap['about']||60} initial={{x:120,y:70}}>
              <AboutContent/>
            </DraggableWindow>
          )}
          {open.projects && !minimized['projects'] && (
  <DraggableWindow
    id="projects"
    title="Projects — Explorer"
    icon={<FolderGit2 size={10} />}
    onClose={closeWindow}
    onMinimize={minimizeWindow}
    onFocus={focus}
    zIndex={zMap['projects'] || 65}
    initial={{ x: 420, y: 160 }}
  >
    <ProjectsContent
      onOpenProject={(p) => { setActiveProject(p); openWindow('projectViewer'); }}
      onSeeMore={() => openWindow('resume')}   // 👈 opens your résumé viewer
    />
  </DraggableWindow>
)}

          {open.projectViewer && !minimized['projectViewer'] && (
            <DraggableWindow id="projectViewer" title="Project Viewer" icon={<ImageIcon size={10}/>} onClose={closeWindow} onMinimize={minimizeWindow} onFocus={focus} zIndex={zMap['projectViewer']||75} initial={{x:620,y:180}}>
              <ProjectViewer project={activeProject}/>
            </DraggableWindow>
          )}
          {open.device && !minimized['device'] && (
            <DraggableWindow id="device" title="Device Monitor — Control Panel" icon={<Wrench size={10}/>} onClose={closeWindow} onMinimize={minimizeWindow} onFocus={focus} zIndex={zMap['device']||70} initial={{x:220,y:360}}>
              <DeviceMonitorContent/>
            </DraggableWindow>
          )}
         {open.resume && !minimized['resume'] && (
  <DraggableWindow
    id="resume"
    chrome="none"                          // no blue XP chrome
    dragHandleRef={resumeBarRef}           // drag from red Adobe bar
    onClose={closeWindow}
    onMinimize={minimizeWindow}
    onFocus={focus}
    zIndex={zMap['resume'] || 72}
    initial={{ x: 380, y: 80 }}
  >
    <ResumeViewer
      titlebarRef={resumeBarRef}
      onClose={() => closeWindow('resume')}         // <-- bound to id
      onMinimize={() => minimizeWindow('resume')}   // <-- bound to id
    />
  </DraggableWindow>
)}


          {open.snake && !minimized['snake'] && (
            <DraggableWindow id="snake" title="Mini Game — Snake" icon={<Gamepad2 size={10}/>} onClose={closeWindow} onMinimize={minimizeWindow} onFocus={focus} zIndex={zMap['snake']||80} initial={{x:180,y:360}}>
              <SnakeGame/>
            </DraggableWindow>
          )}
          {open.mines && !minimized['mines'] && (
            <DraggableWindow id="mines" title="Mini Game — Minesweeper" icon={<Flag size={10}/>} onClose={closeWindow} onMinimize={minimizeWindow} onFocus={focus} zIndex={zMap['mines']||82} initial={{x:260,y:420}}>
              <Minesweeper/>
            </DraggableWindow>
          )}
        </AnimatePresence>

        {/* Taskbar & Start Menu */}
        <Taskbar tasks={taskList} activeId={activeId} onToggleTask={onToggleTask} onStartClick={()=>setStartOpen(v=>!v)}/>
        <AnimatePresence>
          {startOpen && (
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}} transition={{duration:.18}} className="fixed bottom-10 left-2 w-72 bg-[#e8e8e8] border border-[#9a9a9a] shadow-xl overflow-hidden">
              <div className="flex">
                <div className="w-10" style={{background:"linear-gradient(180deg,#245edc 0%,#163f93 100%)"}}/>
                <div className="flex-1">
                  {[
                    {k:'about',label:'About Me',icon:<FileText size={16}/>},
                    {k:'projects',label:'Projects',icon:<FolderGit2 size={16}/>},
                    {k:'device',label:'Device Monitor',icon:<MonitorCog size={16}/>},
                    {k:'resume',label:'Resume',icon:<FileText size={16}/>},
                    {k:'snake',label:'Snake',icon:<Gamepad2 size={16}/>},
                    {k:'mines',label:'Minesweeper',icon:<Flag size={16}/>},
                  ].map(it=> (
                    <button key={it.k} onClick={()=>{ openWindow(it.k); setStartOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/70 text-left">
                      <span className="text-[#245edc]">{it.icon}</span>
                      <span className="text-sm">{it.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
