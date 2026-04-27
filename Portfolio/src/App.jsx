import { useState, useEffect, useRef } from "react";

// ─── FLOWING WATER CANVAS ─────────────────────────────────────────────────────
function WaterCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    let t = 0;
    function drawRipple(cx, cy, r, alpha, t) {
      for (let ring = 0; ring < 4; ring++) {
        const phase = (t * 0.4 + ring * 0.5) % (Math.PI * 2);
        const rr = r * (0.3 + ring * 0.25) + Math.sin(phase) * r * 0.06;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rr, rr * 0.32, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(100,180,220,${alpha * (1 - ring * 0.22)})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
    }
    function drawWave(yBase, amplitude, freq, speed, color, lineW) {
      ctx.beginPath();
      for (let x = 0; x <= W; x += 3) {
        const y = yBase + Math.sin(x * freq + t * speed) * amplitude + Math.sin(x * freq * 1.7 + t * speed * 0.6) * amplitude * 0.4;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color; ctx.lineWidth = lineW; ctx.stroke();
    }
    function frame() {
      ctx.clearRect(0, 0, W, H); t += 0.012;
      drawWave(H * 0.88, 7, 0.008, 0.9, "rgba(80,160,210,0.13)", 1.5);
      drawWave(H * 0.91, 5, 0.012, 1.1, "rgba(100,190,230,0.10)", 1.2);
      drawWave(H * 0.94, 4, 0.016, 0.7, "rgba(60,140,190,0.09)", 1.0);
      drawRipple(W * 0.18, H * 0.92, 60, 0.1, t);
      drawRipple(W * 0.72, H * 0.95, 45, 0.08, t + 1.5);
      drawRipple(W * 0.45, H * 0.97, 35, 0.07, t + 0.8);
      animRef.current = requestAnimationFrame(frame);
    }
    frame();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

// ─── BIRDS CANVAS ─────────────────────────────────────────────────────────────
function BirdsCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    const birds = Array.from({ length: 14 }, () => ({
      x: Math.random() * W * 1.3 - W * 0.15, y: Math.random() * H * 0.45 + H * 0.04,
      vx: 0.35 + Math.random() * 0.5, vy: (Math.random() - 0.5) * 0.15,
      wingT: Math.random() * Math.PI * 2, wingSpeed: 0.045 + Math.random() * 0.03,
      scale: 0.55 + Math.random() * 0.7, opacity: 0.25 + Math.random() * 0.45,
    }));
    function drawBird(x, y, wing, scale, opacity) {
      ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale); ctx.globalAlpha = opacity;
      const flap = Math.sin(wing) * 7;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-14, -flap, -24, flap * 0.3);
      ctx.moveTo(0, 0); ctx.quadraticCurveTo(14, -flap, 24, flap * 0.3);
      ctx.strokeStyle = "#2a6080"; ctx.lineWidth = 1.6; ctx.lineCap = "round"; ctx.stroke(); ctx.restore();
    }
    function frame() {
      ctx.clearRect(0, 0, W, H);
      birds.forEach(b => {
        b.x += b.vx; b.y += b.vy + Math.sin(b.wingT * 0.3) * 0.2; b.wingT += b.wingSpeed;
        if (b.x > W + 60) { b.x = -60; b.y = Math.random() * H * 0.45 + H * 0.04; }
        drawBird(b.x, b.y, b.wingT, b.scale, b.opacity);
      });
      animRef.current = requestAnimationFrame(frame);
    }
    frame();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.9 }} />;
}

// ─── SVG ELEMENTS ─────────────────────────────────────────────────────────────
const TreeSilhouette = ({ style }) => (
  <svg viewBox="0 0 90 200" style={style} fill="none">
    <rect x="40" y="140" width="10" height="60" fill="rgba(60,100,50,0.18)" rx="2" />
    <ellipse cx="45" cy="110" rx="32" ry="40" fill="rgba(50,110,60,0.12)" />
    <ellipse cx="45" cy="80" rx="26" ry="38" fill="rgba(60,130,70,0.10)" />
    <ellipse cx="45" cy="54" rx="20" ry="30" fill="rgba(80,150,80,0.09)" />
    <ellipse cx="28" cy="95" rx="14" ry="18" fill="rgba(70,140,65,0.08)" />
    <ellipse cx="62" cy="88" rx="16" ry="20" fill="rgba(55,125,55,0.09)" />
  </svg>
);

const MountainLine = ({ style }) => (
  <svg viewBox="0 0 600 120" style={style} fill="none" preserveAspectRatio="none">
    <path d="M0 120 L80 60 L140 90 L220 30 L300 70 L380 20 L460 55 L530 35 L600 65 L600 120Z" fill="rgba(80,140,160,0.06)" />
    <path d="M0 120 L100 75 L180 100 L260 50 L340 80 L420 38 L500 65 L580 45 L600 70 L600 120Z" fill="rgba(60,120,145,0.05)" />
    <path d="M0 120 Q150 88 300 95 Q450 102 600 88 L600 120Z" fill="rgba(100,170,200,0.07)" />
  </svg>
);

const LeafIcon = () => (
  <svg viewBox="0 0 36 36" width="26" height="26" fill="none">
    <path d="M18 4 Q30 10 28 24 Q22 32 10 30 Q8 18 18 4Z" fill="#2a7a50" opacity="0.82" />
    <path d="M18 4 Q10 14 12 28" stroke="#1a5a38" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6" />
    <path d="M12 28 Q16 22 22 16" stroke="#1a5a38" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.4" />
    <path d="M12 28 Q10 20 14 14" stroke="#1a5a38" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.4" />
  </svg>
);

const SunRays = ({ style }) => (
  <svg viewBox="0 0 200 200" style={style} fill="none">
    <circle cx="100" cy="100" r="28" fill="rgba(255,220,80,0.08)" />
    <circle cx="100" cy="100" r="18" fill="rgba(255,210,60,0.06)" />
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
      <line key={i}
        x1={100 + Math.cos(deg * Math.PI / 180) * 32} y1={100 + Math.sin(deg * Math.PI / 180) * 32}
        x2={100 + Math.cos(deg * Math.PI / 180) * (50 + (i % 3) * 8)} y2={100 + Math.sin(deg * Math.PI / 180) * (50 + (i % 3) * 8)}
        stroke="rgba(255,210,60,0.10)" strokeWidth="1.2" strokeLinecap="round" />
    ))}
  </svg>
);

const WaterFlow = ({ style }) => (
  <svg viewBox="0 0 120 40" style={style} fill="none">
    {[0, 1, 2, 3].map(i => (
      <path key={i}
        d={`M${i * 30} 20 Q${i * 30 + 8} ${14 + i * 2} ${i * 30 + 15} 20 Q${i * 30 + 22} ${26 - i * 2} ${i * 30 + 30} 20`}
        stroke={`rgba(80,160,210,${0.15 + i * 0.04})`} strokeWidth="1.4" strokeLinecap="round" fill="none" />
    ))}
  </svg>
);

// ─── MALLNAV ARCHITECTURE DIAGRAM ────────────────────────────────────────────
const MallNavDiagram = () => (
  <svg viewBox="0 0 520 200" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ width: "100%", maxWidth: 520, margin: "1.8rem 0", borderRadius: 8, background: "rgba(45,107,58,0.04)", border: "1px solid rgba(60,140,90,0.14)" }}>
    {/* boxes */}
    {[
      { x: 14, y: 72, w: 88, h: 52, label: "Floor Plan\nImage", color: "#3b8fc4" },
      { x: 138, y: 72, w: 88, h: 52, label: "Claude\nVision API", color: "#2a7a50" },
      { x: 262, y: 72, w: 88, h: 52, label: "Dijkstra\nPathfinding", color: "#5a7c4e" },
      { x: 386, y: 72, w: 110, h: 52, label: "QR → Map\nUser UI", color: "#1e6a9a" },
    ].map((b, i) => (
      <g key={i}>
        <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="7" fill={b.color} fillOpacity="0.10" stroke={b.color} strokeOpacity="0.35" strokeWidth="1.4" />
        {b.label.split("\n").map((line, li) => (
          <text key={li} x={b.x + b.w / 2} y={b.y + 22 + li * 16} textAnchor="middle" fill={b.color} fontSize="11" fontWeight="600" fontFamily="DM Sans, sans-serif">{line}</text>
        ))}
      </g>
    ))}
    {/* arrows */}
    {[[102, 98, 138, 98], [226, 98, 262, 98], [350, 98, 386, 98]].map(([x1, y1, x2, y2], i) => (
      <g key={i}>
        <line x1={x1} y1={y1} x2={x2 - 6} y2={y2} stroke="#5a7c4e" strokeWidth="1.5" strokeDasharray="4 3" />
        <polygon points={`${x2},${y2} ${x2 - 7},${y2 - 4} ${x2 - 7},${y2 + 4}`} fill="#5a7c4e" />
      </g>
    ))}
    {/* labels above arrows */}
    {[
      { x: 120, y: 90, text: "CV Pipeline" },
      { x: 244, y: 90, text: "50+ POIs" },
      { x: 368, y: 90, text: "Route" },
    ].map((l, i) => (
      <text key={i} x={l.x} y={l.y} textAnchor="middle" fill="#5a7c4e" fontSize="9" fontFamily="DM Sans, sans-serif" opacity="0.75">{l.text}</text>
    ))}
    {/* metrics strip */}
    {[
      { x: 58, label: "95%", sub: "Accuracy" },
      { x: 182, label: "90%", sub: "Faster Setup" },
      { x: 306, label: "1K+", sub: "Concurrent" },
      { x: 441, label: "99.5%", sub: "Uptime" },
    ].map((m, i) => (
      <g key={i}>
        <text x={m.x} y={152} textAnchor="middle" fill="#1e6a9a" fontSize="13" fontWeight="700" fontFamily="DM Sans, sans-serif">{m.label}</text>
        <text x={m.x} y={167} textAnchor="middle" fill="#8a9e8e" fontSize="9" fontFamily="DM Sans, sans-serif">{m.sub}</text>
      </g>
    ))}
    <line x1="14" y1="140" x2="506" y2="140" stroke="rgba(60,140,90,0.12)" strokeWidth="1" />
    <text x="260" y="190" textAnchor="middle" fill="#8a9e8e" fontSize="9" fontFamily="DM Sans, sans-serif" fontStyle="italic">MallNav · System Architecture Overview</text>
  </svg>
);

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────
function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let s = 0; const step = target / 60;
        const t = setInterval(() => {
          s += step;
          if (s >= target) { setVal(target); clearInterval(t); }
          else setVal(Math.floor(s));
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── TYPEWRITER ───────────────────────────────────────────────────────────────
function Typewriter({ strings }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = strings[idx % strings.length];
    const timer = setTimeout(() => {
      if (!del) {
        setText(cur.slice(0, text.length + 1));
        if (text.length + 1 === cur.length) setTimeout(() => setDel(true), 1600);
      } else {
        setText(cur.slice(0, text.length - 1));
        if (text.length - 1 === 0) { setDel(false); setIdx(i => i + 1); }
      }
    }, del ? 45 : 85);
    return () => clearTimeout(timer);
  }, [text, del, idx, strings]);
  return <span>{text}<span className="cblink">|</span></span>;
}

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, from = "bottom" }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const tf = vis ? "none" : from === "left" ? "translateX(-42px)" : from === "right" ? "translateX(42px)" : "translateY(38px)";
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: tf, transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

// ─── 3D TILT ─────────────────────────────────────────────────────────────────
function TiltCard({ children, style = {} }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 14;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -14;
    ref.current.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) scale3d(1.02,1.02,1.02)`;
  };
  const onLeave = () => { ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0)"; };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ ...style, transition: "transform 0.18s ease", transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const SKILLS = [
  { cat: "Core", icon: "🌿", items: ["Python", "JavaScript", "TypeScript", "Django", "React.js", "Node.js"] },
  { cat: "AI / ML", icon: "🌤️", items: ["Claude Vision API", "Computer Vision", "OpenCV", "NLP", "Generative AI"] },
  { cat: "DevOps & Cloud", icon: "🍃", items: ["Docker", "AWS", "CI/CD", "Railway", "GitHub Actions"] },
  { cat: "Databases", icon: "💧", items: ["MySQL", "PostgreSQL", "SQLite", "Firebase"] },
  { cat: "System Design", icon: "🏛️", items: ["Multi-Tenant SaaS", "JWT RBAC", "REST APIs", "DRF", "NetworkX"] },
  { cat: "Security & A11y", icon: "🦋", items: ["WCAG 2.1 AA", "ARIA", "Semantic HTML", "Secure Auth"] },
];

const PROJECTS = [
  {
    title: "MallNav",
    subtitle: "AI-Powered Indoor Navigation",
    icon: "🧭",
    stack: ["Python", "Django", "PostgreSQL", "NetworkX", "Claude Vision API", "OpenCV"],
    metrics: ["95% route accuracy", "1,000+ concurrent users", "90% setup time cut", "99.5% uptime"],
    problem: "Mall operators spent 8+ hours manually mapping floor plans and annotating 50+ POIs per venue, making scalable deployment impossible.",
    solution: "Built a computer vision pipeline using Claude Vision API + OpenCV to auto-classify POIs from floor plan images, feeding into a Dijkstra's graph engine for multi-floor pathfinding. QR-code entry eliminates app downloads.",
    result: "Setup time dropped from 8 hours to 45 minutes. Route accuracy hit 95%. System handles 1,000+ concurrent users with 99.5% uptime.",
    showDiagram: true,
  },
  {
    title: "Formalls",
    subtitle: "Enterprise Multi-Tenant SaaS",
    icon: "🏢",
    stack: ["Django", "React.js", "MySQL", "JWT", "REST API", "Docker"],
    metrics: ["10,000+ DAU", "50,000+ req/day", "30% engagement lift", "60% faster DB"],
    problem: "Mall operators needed a unified platform to manage 100+ stores, 20+ restaurants and 500+ daily bookings — all in one multi-tenant system with strict data isolation.",
    solution: "Designed a multi-tenant Django backend with JWT authentication and 5-tier RBAC. Built collaborative filtering for recommendations, real-time conflict detection for bookings, and a live analytics dashboard.",
    result: "10,000+ daily active users, 50,000+ API requests/day at 99.9% uptime, 60% faster DB queries after query optimization.",
    showDiagram: false,
  },
];

const STATS = [
  { label: "Daily API Requests", val: 50000, suffix: "+" },
  { label: "Daily Active Users", val: 10000, suffix: "+" },
  { label: "API Uptime", val: 99, suffix: ".9%" },
  { label: "Query Speed Boost", val: 60, suffix: "%" },
];

const BLOG_POSTS = [
  {
    title: "How I Optimized MySQL Queries by 60%",
    tag: "Backend",
    desc: "The exact indexing, query rewriting and connection-pool tweaks that took our API from sluggish to 50K+ req/day without touching the schema.",
    emoji: "💧",
  },
  {
    title: "Multi-Tenant Architecture with Django: Lessons Learned",
    tag: "System Design",
    desc: "Building strict data isolation for 5+ enterprise clients in a single Django codebase — schema choices, middleware tricks and the bugs I wish I caught earlier.",
    emoji: "🏛️",
  },
  {
    title: "Claude Vision API in Production: A Practical Guide",
    tag: "AI / ML",
    desc: "How I integrated Claude Vision API into a real-time POI classification pipeline, handling edge cases, cost control and accuracy tuning.",
    emoji: "🌤️",
  },
];

const NAV = ["home", "about", "experience", "projects", "skills", "notes", "contact"];

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expandedProj, setExpandedProj] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 55);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.28 }
    );
    NAV.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg:    #eef5f0; --bg2: #e2efe6; --bg3: #d4e8da; --light: #f5faf6;
          --sky:   #3b8fc4; --sky2: #1e6a9a; --water: #4aabcc; --water2: #2d8aaa;
          --forest:#2d6b3a; --fdk: #1a4826; --moss: #5a7c4e; --stone: #8a9e8e;
          --text:  #1a2e20; --muted: #4a6454; --gold: #b8a040; --gold2: #d4bc5a;
          --border:rgba(60,140,90,0.18);
          --fhead: 'Playfair Display', serif;
          --fsub:  'Crimson Pro', serif;
          --fbody: 'DM Sans', sans-serif;
        }
        html { scroll-behavior: smooth; }
        body {
          background: var(--bg);
          background-image:
            radial-gradient(ellipse at 20% 0%, rgba(100,190,230,0.12) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 5%, rgba(255,230,100,0.08) 0%, transparent 45%),
            radial-gradient(ellipse at 50% 100%, rgba(60,140,100,0.10) 0%, transparent 60%);
          color: var(--text); font-family: var(--fbody); overflow-x: hidden;
        }
        ::selection { background: var(--water); color: #fff; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: var(--bg2); }
        ::-webkit-scrollbar-thumb { background: var(--sky); border-radius: 3px; }
        body::before { content:''; position:fixed; top:0; left:0; right:0; height:40vh; z-index:0; pointer-events:none; background: linear-gradient(180deg, rgba(180,220,240,0.22) 0%, rgba(200,235,245,0.08) 60%, transparent 100%); }
        body::after { content:''; position:fixed; inset:0; z-index:0; pointer-events:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.028'/%3E%3C/svg%3E"); opacity:0.55; }

        /* NAV */
        nav { position:fixed; top:0; left:0; right:0; z-index:200; display:flex; align-items:center; justify-content:space-between; padding:0 3rem; height:66px; transition: background 0.4s, box-shadow 0.4s; }
        nav.scrolled { background:rgba(238,245,240,0.94); backdrop-filter:blur(18px); box-shadow:0 1px 0 var(--border); }
        .nav-logo { font-family:var(--fhead); font-size:1.28rem; color:var(--forest); display:flex; align-items:center; gap:0.55rem; }
        .nav-links { display:flex; gap:2.4rem; list-style:none; align-items:center; }
        .nav-links a { font-size:0.68rem; font-weight:500; letter-spacing:0.14em; text-transform:uppercase; color:var(--muted); text-decoration:none; transition:color 0.22s; position:relative; }
        .nav-links a::after { content:''; position:absolute; bottom:-3px; left:0; width:0; height:2px; background:var(--sky); transition:width 0.3s; border-radius:1px; }
        .nav-links a:hover, .nav-links a.active { color:var(--sky2); }
        .nav-links a:hover::after, .nav-links a.active::after { width:100%; }
        .nav-resume { font-size:0.66rem; font-weight:500; letter-spacing:0.14em; text-transform:uppercase; padding:0.45rem 1.1rem; border-radius:4px; background:var(--sky); color:#fff; text-decoration:none; transition:all 0.22s; border:none; cursor:pointer; }
        .nav-resume:hover { background:var(--sky2); transform:translateY(-1px); }
        .hamburger { display:none; flex-direction:column; gap:5px; cursor:pointer; padding:5px; }
        .hamburger span { width:24px; height:2px; background:var(--sky); display:block; }

        /* HERO */
        #home { min-height:100vh; display:flex; align-items:center; padding:6rem 5rem 4rem 6rem; gap:3rem; flex-wrap:wrap; position:relative; overflow:hidden; }
        .hero-left { flex:1; min-width:300px; max-width:580px; position:relative; z-index:2; }
        .hero-right { flex:0 0 420px; display:flex; align-items:center; justify-content:center; position:relative; z-index:1; }
        .hero-tagline { font-family:var(--fsub); font-style:italic; font-size:0.92rem; color:var(--water); letter-spacing:0.06em; margin-bottom:1.2rem; display:flex; align-items:center; gap:1rem; }
        .hero-tagline::before, .hero-tagline::after { content:''; flex:1; max-width:45px; height:1px; background:linear-gradient(to right, transparent, var(--water)); }
        h1.hero-name { font-family:var(--fhead); font-size:clamp(2.8rem,6.5vw,5.5rem); line-height:1.05; color:var(--forest); text-shadow:1px 3px 0 rgba(45,107,58,0.12); margin-bottom:0.5rem; }
        .hero-spec { font-size:0.72rem; font-weight:500; letter-spacing:0.18em; text-transform:uppercase; color:var(--moss); background:rgba(90,124,78,0.09); border:1px solid rgba(90,124,78,0.22); border-radius:3px; padding:0.3rem 0.9rem; display:inline-block; margin-bottom:0.9rem; }
        .hero-title { font-size:clamp(1rem,2.5vw,1.2rem); font-weight:300; color:var(--sky2); letter-spacing:0.05em; margin-bottom:1.7rem; min-height:2rem; font-family:var(--fsub); }
        .hero-desc { font-size:0.97rem; line-height:1.9; color:var(--muted); margin-bottom:2.4rem; max-width:490px; font-family:var(--fsub); }
        .hero-cta { display:flex; gap:1rem; flex-wrap:wrap; align-items:center; }
        .btn { font-size:0.72rem; font-weight:500; letter-spacing:0.18em; text-transform:uppercase; padding:0.85rem 2.2rem; border-radius:4px; cursor:pointer; transition:all 0.24s; text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem; font-family:var(--fbody); }
        .btn-pri { background:var(--sky); color:#fff; box-shadow:4px 4px 0 var(--sky2), 0 6px 20px rgba(59,143,196,0.28); }
        .btn-pri:hover { background:var(--sky2); transform:translate(-2px,-2px); box-shadow:7px 7px 0 #0e4d73; }
        .btn-out { background:transparent; color:var(--forest); border:2px solid var(--forest); box-shadow:3px 3px 0 var(--fdk); }
        .btn-out:hover { background:var(--forest); color:#fff; transform:translate(-2px,-2px); box-shadow:6px 6px 0 var(--fdk); }
        .btn-ghost { background:transparent; color:var(--sky2); border:1.5px solid rgba(59,143,196,0.35); padding:0.75rem 1.4rem; border-radius:4px; font-size:0.68rem; letter-spacing:0.14em; text-transform:uppercase; text-decoration:none; transition:all 0.22s; display:inline-flex; align-items:center; gap:0.4rem; font-family:var(--fbody); font-weight:500; }
        .btn-ghost:hover { background:rgba(59,143,196,0.08); border-color:var(--sky); }

        /* MEDALLION */
        .medallion { width:360px; height:360px; border-radius:50%; position:relative; background:radial-gradient(circle at 38% 30%, #c8e8f8, #70bce0, #2d7aaa); border:4px solid rgba(100,180,220,0.35); box-shadow:0 0 0 14px rgba(80,160,210,0.07), 0 0 0 28px rgba(80,160,210,0.04), inset 0 0 70px rgba(20,80,130,0.18), 0 24px 70px rgba(40,110,170,0.24); display:flex; align-items:center; justify-content:center; animation:float 5.5s ease-in-out infinite; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .medallion::before { content:''; position:absolute; inset:12px; border-radius:50%; border:1px solid rgba(180,230,255,0.3); }
        .medallion::after  { content:''; position:absolute; inset:26px; border-radius:50%; border:1px dashed rgba(180,230,255,0.18); }
        .med-text { text-align:center; position:relative; z-index:2; }
        .med-initials { font-family:var(--fhead); font-size:5rem; color:rgba(255,255,255,0.95); text-shadow:2px 5px 18px rgba(20,60,100,0.40); line-height:1; }
        .med-city { font-family:var(--fsub); font-style:italic; font-size:0.78rem; color:rgba(255,255,255,0.6); letter-spacing:0.1em; margin-top:0.4rem; }
        .landscape-wrap { position:absolute; bottom:0; left:0; right:0; pointer-events:none; }

        /* STATS */
        .stats-row { display:grid; grid-template-columns:repeat(4,1fr); background:var(--light); border-top:2px solid var(--border); border-bottom:2px solid var(--border); position:relative; z-index:2; }
        .stat-cell { padding:2.8rem 1.5rem; text-align:center; border-right:1px solid var(--border); }
        .stat-cell:last-child { border-right:none; }
        .stat-val { font-family:var(--fhead); font-size:2.9rem; color:var(--sky); line-height:1; margin-bottom:0.4rem; }
        .stat-lbl { font-size:0.7rem; font-weight:500; letter-spacing:0.13em; text-transform:uppercase; color:var(--muted); }

        /* SECTION COMMON */
        .sec { padding:7rem 5rem; position:relative; z-index:1; max-width:1260px; margin:0 auto; }
        .eyebrow { display:flex; align-items:center; gap:1rem; margin-bottom:0.8rem; font-size:0.67rem; font-weight:500; letter-spacing:0.26em; text-transform:uppercase; color:var(--moss); }
        .eyebrow::before { content:''; width:36px; height:2px; background:var(--moss); flex-shrink:0; }
        .sec-title { font-family:var(--fhead); font-size:clamp(1.9rem,4.5vw,3.1rem); color:var(--forest); line-height:1.15; margin-bottom:3.5rem; }
        .bg-alt { background:var(--bg2); }
        .nature-bg { position:absolute; font-family:var(--fhead); color:rgba(60,140,90,0.05); font-size:14rem; line-height:1; pointer-events:none; user-select:none; font-style:italic; }

        /* ABOUT */
        .about-grid { display:grid; grid-template-columns:1fr 1.55fr; gap:6rem; align-items:center; }
        .avatar-frame { aspect-ratio:1; border-radius:50%; background:radial-gradient(circle at 35% 35%, #d8eef8, #70c0e0, #2070a0); border:4px solid rgba(100,180,220,0.4); max-width:300px; margin:0 auto; box-shadow:0 0 0 9px rgba(80,160,210,0.09), 14px 18px 44px rgba(30,90,140,0.22); display:flex; align-items:center; justify-content:center; }
        .avatar-init { font-family:var(--fhead); font-size:5.5rem; color:rgba(255,255,255,0.94); text-shadow:2px 4px 14px rgba(20,60,110,0.38); }
        .about-p { font-size:0.96rem; line-height:1.92; color:var(--muted); margin-bottom:1.1rem; font-family:var(--fsub); }
        .about-p strong { color:var(--sky2); font-weight:600; }
        .edu-card { margin-top:0.8rem; padding:1.15rem 1.5rem; border-left:3px solid var(--water); background:rgba(74,171,204,0.07); border-radius:0 6px 6px 0; }
        .edu-deg { font-weight:600; font-size:0.88rem; color:var(--text); margin-bottom:0.2rem; }
        .edu-school { font-size:0.8rem; color:var(--forest); }
        .edu-period { font-size:0.72rem; color:var(--stone); margin-top:0.2rem; }

        /* TIMELINE */
        .timeline { position:relative; padding-left:2.5rem; }
        .timeline::before { content:''; position:absolute; left:0; top:6px; bottom:0; width:2px; background:linear-gradient(to bottom, var(--sky), transparent); }
        .t-item { position:relative; margin-bottom:3.5rem; padding-left:2.2rem; }
        .t-dot { position:absolute; left:-2.73rem; top:6px; width:12px; height:12px; border-radius:50%; background:var(--sky); border:2px solid var(--water2); box-shadow:0 0 10px rgba(59,143,196,0.4); }
        .t-role { font-family:var(--fhead); font-size:1.3rem; color:var(--forest); }
        .t-company { font-size:0.9rem; font-weight:500; color:var(--sky2); margin:0.22rem 0; }
        .t-meta { font-size:0.73rem; color:var(--stone); letter-spacing:0.05em; margin-bottom:1.2rem; }
        .t-bullets { list-style:none; }
        .t-bullets li { font-size:0.9rem; line-height:1.78; color:var(--muted); padding:0.55rem 0 0.55rem 1.4rem; border-bottom:1px solid rgba(60,140,100,0.08); position:relative; font-family:var(--fsub); }
        .t-bullets li::before { content:'◈'; position:absolute; left:0; color:var(--moss); font-size:0.7rem; top:0.7rem; }

        /* PROJECTS */
        .proj-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(518px,1fr)); gap:2.5rem; }
        .proj-card { background:var(--light); border:1px solid var(--border); border-radius:10px; padding:2.5rem; position:relative; overflow:hidden; box-shadow:6px 6px 0 rgba(60,140,100,0.09); transition:box-shadow 0.25s; }
        .proj-card:hover { box-shadow:10px 10px 0 rgba(60,140,100,0.16); }
        .proj-card::before { content:''; position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg, var(--sky), var(--water), var(--forest)); }
        .proj-top { display:flex; align-items:flex-start; gap:1.2rem; margin-bottom:1rem; }
        .proj-icon { width:52px; height:52px; border-radius:10px; background:linear-gradient(135deg,var(--bg3),var(--bg2)); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-size:1.6rem; flex-shrink:0; }
        .proj-title { font-family:var(--fhead); font-size:1.4rem; color:var(--forest); }
        .proj-sub { font-size:0.78rem; color:var(--stone); margin-top:0.15rem; }
        .psr { display:grid; grid-template-columns:1fr 1fr 1fr; gap:0; margin:1.2rem 0; border:1px solid var(--border); border-radius:8px; overflow:hidden; }
        .psr-cell { padding:1rem 1.1rem; }
        .psr-cell:nth-child(2) { border-left:1px solid var(--border); border-right:1px solid var(--border); }
        .psr-label { font-size:0.6rem; font-weight:500; letter-spacing:0.2em; text-transform:uppercase; color:var(--moss); margin-bottom:0.4rem; }
        .psr-text { font-size:0.82rem; line-height:1.65; color:var(--muted); font-family:var(--fsub); }
        .psr-cell:nth-child(1) .psr-label { color:#c0503a; }
        .psr-cell:nth-child(2) .psr-label { color:var(--sky2); }
        .psr-cell:nth-child(3) .psr-label { color:var(--forest); }
        .psr-cell:nth-child(1) { background:rgba(192,80,58,0.04); }
        .psr-cell:nth-child(2) { background:rgba(59,143,196,0.04); }
        .psr-cell:nth-child(3) { background:rgba(45,107,58,0.04); }
        .metrics { display:flex; flex-wrap:wrap; gap:0.5rem; margin:1.2rem 0; }
        .metric { font-size:0.67rem; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; padding:0.3rem 0.85rem; border-radius:3px; background:rgba(59,143,196,0.08); border:1px solid rgba(59,143,196,0.22); color:var(--sky2); }
        .stack { display:flex; flex-wrap:wrap; gap:0.4rem; margin-top:1rem; }
        .stag { font-size:0.72rem; padding:0.25rem 0.75rem; border-radius:3px; background:rgba(45,107,58,0.07); border:1px solid rgba(45,107,58,0.17); color:var(--forest); }
        .proj-toggle { background:none; border:none; cursor:pointer; font-size:0.72rem; color:var(--sky2); letter-spacing:0.1em; text-transform:uppercase; font-family:var(--fbody); font-weight:500; margin-top:0.8rem; display:flex; align-items:center; gap:0.4rem; padding:0; }
        .proj-toggle:hover { color:var(--sky); }

        /* SKILLS */
        .skill-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(339px,1fr)); gap:0.8rem; }
        .sg { background:var(--light); border:1px solid var(--border); border-radius:8px; padding:0.8rem; box-shadow:4px 4px 0 rgba(60,140,100,0.07); }
        .sg-head { display:flex; align-items:center; gap:0.6rem; font-size:0.67rem; font-weight:500; letter-spacing:0.18em; text-transform:uppercase; color:var(--sky2); margin-bottom:1.1rem; }
        .chips { display:flex; flex-wrap:wrap; gap:0.5rem; }
        .chip { font-size:0.8rem; padding:0.35rem 0.9rem; border-radius:4px; background:var(--bg); border:1px solid var(--border); color:var(--text); transition:all 0.2s; cursor:default; }
        .chip:hover { background:var(--sky); color:#fff; border-color:var(--sky); transform:translateY(-2px); box-shadow:0 4px 12px rgba(59,143,196,0.25); }

        /* NOTES / BLOG */
        .notes-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(290px,1fr)); gap:1.8rem; }
        .note-card { background:var(--light); border:1px solid var(--border); border-radius:10px; padding:2rem; box-shadow:4px 4px 0 rgba(60,140,100,0.07); transition:all 0.25s; position:relative; overflow:hidden; }
        .note-card:hover { box-shadow:8px 8px 0 rgba(60,140,100,0.14); transform:translate(-2px,-2px); }
        .note-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg, var(--water), var(--forest)); }
        .note-tag { font-size:0.62rem; font-weight:500; letter-spacing:0.18em; text-transform:uppercase; color:var(--sky2); background:rgba(59,143,196,0.08); border:1px solid rgba(59,143,196,0.2); border-radius:3px; padding:0.2rem 0.65rem; display:inline-block; margin-bottom:0.8rem; }
        .note-emoji { font-size:1.8rem; margin-bottom:0.6rem; display:block; }
        .note-title { font-family:var(--fhead); font-size:1.05rem; color:var(--forest); margin-bottom:0.6rem; line-height:1.3; }
        .note-desc { font-size:0.86rem; line-height:1.72; color:var(--muted); font-family:var(--fsub); }
        .note-footer { margin-top:1.2rem; font-size:0.68rem; color:var(--stone); font-weight:500; letter-spacing:0.1em; display:flex; align-items:center; gap:0.4rem; }
        .coming-soon { font-size:0.65rem; background:rgba(184,160,64,0.12); border:1px solid rgba(184,160,64,0.3); color:var(--gold); border-radius:3px; padding:0.15rem 0.55rem; }

        /* INTERESTS */
        .interests-row { display:flex; flex-wrap:wrap; gap:1rem; margin-top:1.5rem; }
        .interest-pill { display:flex; align-items:center; gap:0.5rem; padding:0.55rem 1.1rem; border-radius:40px; background:var(--light); border:1px solid var(--border); font-size:0.82rem; color:var(--muted); font-family:var(--fsub); transition:all 0.2s; }
        .interest-pill:hover { background:var(--bg3); border-color:var(--moss); color:var(--forest); }

        /* CONTACT */
        .contact-links { display:flex; flex-wrap:wrap; gap:1.2rem; justify-content:center; margin-top:3rem; }
        .clink { display:flex; align-items:center; gap:1rem; padding:1.2rem 2rem; background:var(--light); border:1px solid var(--border); border-radius:8px; text-decoration:none; color:var(--text); font-size:0.88rem; box-shadow:4px 4px 0 rgba(60,140,100,0.09); transition:all 0.25s; }
        .clink:hover { background:var(--sky); color:#fff; box-shadow:6px 6px 0 var(--sky2); transform:translate(-2px,-2px); }

        /* FOOTER */
        footer { background:var(--forest); color:rgba(255,255,255,0.6); text-align:center; padding:2.8rem 2rem; font-size:0.75rem; letter-spacing:0.12em; position:relative; z-index:1; }
        footer .fn { font-family:var(--fhead); font-size:0.95rem; color:rgba(180,230,255,0.9); }
        footer .shloka { font-family:var(--fsub); font-style:italic; opacity:0.45; margin-top:0.5rem; font-size:0.82rem; }

        /* DIVIDER */
        .divider { display:flex; align-items:center; gap:1.5rem; max-width:180px; margin:0 auto 3rem; color:var(--moss); font-size:1.1rem; }
        .divider::before, .divider::after { content:''; flex:1; height:1px; background:linear-gradient(to right,transparent,var(--moss),transparent); }

        /* misc */
        .cblink { animation:cblink 0.85s step-end infinite; color:var(--sky); }
        @keyframes cblink { 0%,100%{opacity:1} 50%{opacity:0} }
        .mob-menu { position:fixed; inset:0; background:rgba(238,245,240,0.97); z-index:300; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2.5rem; }
        .mob-menu a { font-family:var(--fhead); font-size:1.5rem; color:var(--muted); text-decoration:none; }
        .mob-menu a:hover { color:var(--forest); }

        @media(max-width:900px){
          #home { padding:5rem 2rem 3rem; flex-direction:column; }
          .hero-right { flex:none; width:100%; }
          .medallion { width:260px; height:260px; margin:0 auto; }
          .about-grid { grid-template-columns:1fr; gap:3rem; }
          .sec { padding:5rem 1.8rem; }
          .stats-row { grid-template-columns:repeat(2,1fr); }
          nav { padding:0 1.5rem; }
          .nav-links { display:none; }
          .hamburger { display:flex; }
          .psr { grid-template-columns:1fr; }
          .psr-cell:nth-child(2) { border-left:none; border-right:none; border-top:1px solid var(--border); border-bottom:1px solid var(--border); }
        }
      `}</style>

      <WaterCanvas />
      <BirdsCanvas />

      {/* NAV */}
      <nav className={scrolled ? "scrolled" : ""}>
        <div className="nav-logo"><LeafIcon />Sudeep Bhimannavar</div>
        <ul className="nav-links">
          {NAV.map(s => (
            <li key={s}><a href={`#${s}`} className={active === s ? "active" : ""} onClick={e => { e.preventDefault(); scrollTo(s); }}>{s}</a></li>
          ))}
          <li><a href="/resume.pdf" className="nav-resume" download>↓ Resume</a></li>
        </ul>
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </div>
      </nav>

      {menuOpen && (
        <div className="mob-menu">
          <div style={{ fontFamily: "var(--fhead)", fontSize: "1.6rem", color: "var(--forest)", marginBottom: "1rem" }}>🌿 Menu</div>
          {NAV.map(s => <a key={s} href={`#${s}`} onClick={e => { e.preventDefault(); scrollTo(s); }}>{s}</a>)}
          <a href="/resume.pdf" download style={{ fontSize: "0.9rem", background: "var(--sky)", color: "#fff", padding: "0.6rem 1.6rem", borderRadius: "4px", textDecoration: "none" }}>↓ Download Resume</a>
        </div>
      )}

      {/* HERO */}
      <div id="home">
        <div className="landscape-wrap">
          <MountainLine style={{ width: "100%", height: "120px" }} />
        </div>
        <SunRays style={{ position: "absolute", right: "8%", top: "12%", width: "180px", height: "180px", pointerEvents: "none", zIndex: 0 }} />
        <TreeSilhouette style={{ position: "absolute", left: "2%", bottom: "0", width: "80px", height: "160px", pointerEvents: "none", zIndex: 0 }} />
        <TreeSilhouette style={{ position: "absolute", right: "3%", bottom: "0", width: "65px", height: "130px", pointerEvents: "none", zIndex: 0, transform: "scaleX(-1)" }} />

        <div className="hero-left">
          <div className="hero-tagline">Software Engineer</div>
          <h1 className="hero-name">Sudeep<br />Bhimannavar</h1>
          {/* Gemini rec #1: specialisation badge */}
          <div className="hero-spec">Full-Stack Engineer · Generative AI & Scalable SaaS</div>
          <div className="hero-title">
            <Typewriter strings={["Full-Stack Engineer", "SaaS Architect", "AI Systems Builder", "Backend Specialist", "10K+ DAU Platform Builder"]} />
          </div>
          <p className="hero-desc">Building production-grade distributed systems that scale — from concept to 50,000+ daily requests. Django × React × AI, shipped with discipline and precision.</p>
          {/* Gemini rec #1: Resume CTA visible immediately */}
          <div className="hero-cta">
            <a href="#projects" className="btn btn-pri" onClick={e => { e.preventDefault(); scrollTo("projects"); }}>View My Work</a>
            <a href="#contact" className="btn btn-out" onClick={e => { e.preventDefault(); scrollTo("contact"); }}>Get In Touch</a>
            <a href="/resume.pdf" className="btn-ghost" download>↓ Resume</a>
          </div>
        </div>

        <div className="hero-right">
          <div style={{ position: "relative" }}>
            <TiltCard>
              <div className="medallion">
                <div className="med-text">
                  <div className="med-initials">SB</div>
                  <div className="med-city">Bengaluru, India</div>
                </div>
                <div style={{ position: "absolute", inset: "32px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.16)", pointerEvents: "none" }} />
              </div>
            </TiltCard>
            <WaterFlow style={{ position: "absolute", bottom: "-28px", left: "50%", transform: "translateX(-50%)", width: "110px", height: "36px", opacity: 0.7 }} />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-row">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 100}>
            <div className="stat-cell">
              <div className="stat-val"><Counter target={s.val} suffix={s.suffix} /></div>
              <div className="stat-lbl">{s.label}</div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* ABOUT */}
      <section id="about">
        <div className="sec">
          <div className="nature-bg" style={{ top: "-2rem", right: "-1rem" }}>∿</div>
          <div className="eyebrow">01 — The Engineer</div>
          <h2 className="sec-title">Crafted by Curiosity,<br />Tempered by Production</h2>
          <div className="about-grid">
            <Reveal from="left">
              <TiltCard>
                <div className="avatar-frame">
                  <div className="avatar-init">SB</div>
                </div>
              </TiltCard>
            </Reveal>
            <Reveal from="right" delay={160}>
              <div>
                <p className="about-p">I'm a <strong>Full-Stack Software Engineer</strong> specialising in Generative AI and scalable SaaS — with 10+ months of production experience designing, developing and deploying distributed systems at real scale, not demo scale.</p>
                <p className="about-p">My craft lives at the intersection of <strong>backend architecture, AI integration, and user-facing products</strong>. I've scaled RESTful APIs to 50K+ req/day, built AI-powered navigation using computer vision and graph algorithms, and shipped multi-tenant platforms serving 10,000+ daily active users.</p>
                <p className="about-p">I care deeply about <strong>code quality</strong> (85%+ test coverage via TDD), <strong>accessibility</strong> (WCAG 2.1 AA), and systems designed to grow well beyond their launch day.</p>

                {/* Gemini rec #5: Interests / Human element */}
                <div style={{ marginTop: "1.8rem" }}>
                  <div style={{ fontSize: "0.67rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--moss)", marginBottom: "0.7rem" }}>Beyond the Code</div>
                  <div className="interests-row">
                    {[
                      { emoji: "🏎️", label: "Formula 1 Fan" },
                      { emoji: "🎌", label: "Anime Enthusiast" },
                      { emoji: "📚", label: "Crime & Mystery Reader" },
                      { emoji: "🔍", label: "Robert Langdon Series" },
                      { emoji: "🌿", label: "Nature Walks" },
                    ].map(item => (
                      <div key={item.label} className="interest-pill"><span>{item.emoji}</span><span>{item.label}</span></div>
                    ))}
                  </div>
                </div>

                <div className="edu-card" style={{ marginTop: "2rem" }}>
                  <div className="edu-deg">MCA — Master of Computer Applications</div>
                  <div className="edu-school">Jain University, Bengaluru</div>
                  <div className="edu-period">2025 – 2027 · Distance Learning</div>
                </div>
                <div className="edu-card">
                  <div className="edu-deg">BCA — Bachelor of Computer Applications</div>
                  <div className="edu-school">Bharatesh College of Computer Applications, Belagavi</div>
                  <div className="edu-period">2020 – 2023</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <div className="bg-alt" style={{ position: "relative", zIndex: 1 }}>
        <section id="experience">
          <div className="sec">
            <div className="eyebrow">02 — Battle-Tested</div>
            <h2 className="sec-title">Where I've Shipped Production <br /> Systems</h2>
            <div className="timeline">
              <Reveal>
                <div className="t-item">
                  <div className="t-dot" />
                  <div className="t-role">Software Engineer</div>
                  <div className="t-company">Vividhity Ventures Private Limited</div>
                  <div className="t-meta">July 2025 – Present · Bengaluru, Karnataka, India</div>
                  <ul className="t-bullets">
                    <li>Designed, developed and deployed <strong>Formalls</strong> — a production multi-tenant SaaS (Django + React.js + MySQL) serving 5+ enterprise clients and 10,000+ daily active users across shop management, booking and event modules; ensured WCAG 2.1 AA compliance.</li>
                    <li>Built <strong>MallNav</strong> — AI-powered indoor navigation using Dijkstra's algorithm on dynamic corridor graphs; integrated Claude Vision API + OpenCV to auto-classify 50+ POIs at 90% accuracy, reducing navigation time by 40%.</li>
                    <li>Designed and maintained 15+ RESTful APIs at 50,000+ req/day and 99.9% uptime; resolved SQL query bottlenecks cutting average response time by 60%; authored full technical documentation.</li>
                    <li>Enforced 85%+ test coverage through TDD and CI/CD in an 8-member Agile team; integrated WhatsApp Business API reducing ticket volume by 45% and achieving 95% CSAT.</li>
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </div>

      {/* PROJECTS — Gemini rec #2 & #3: PSR case study format + architecture diagram */}
      <section id="projects">
        <div className="sec">
          <div className="nature-bg" style={{ bottom: "2rem", left: "-2rem" }}>∿</div>
          <div className="eyebrow">03 — Proof of Work</div>
          <h2 className="sec-title">Systems That Move the Needle</h2>
          <div className="proj-grid">
            {PROJECTS.map((p, i) => {
              const isExpanded = expandedProj === p.title;
              return (
                <Reveal key={p.title} delay={i * 150}>
                  <TiltCard>
                    <div className="proj-card">
                      <div className="proj-top">
                        <div className="proj-icon">{p.icon}</div>
                        <div>
                          <div className="proj-title">{p.title}</div>
                          <div className="proj-sub">{p.subtitle}</div>
                        </div>
                      </div>

                      {/* PSR: Problem → Solution → Result */}
                      <div className="psr">
                        <div className="psr-cell">
                          <div className="psr-label">⚠ Problem</div>
                          <div className="psr-text">{p.problem}</div>
                        </div>
                        <div className="psr-cell">
                          <div className="psr-label">⚙ Solution</div>
                          <div className="psr-text">{p.solution}</div>
                        </div>
                        <div className="psr-cell">
                          <div className="psr-label">✓ Result</div>
                          <div className="psr-text">{p.result}</div>
                        </div>
                      </div>

                      {/* Architecture diagram for MallNav */}
                      {p.showDiagram && (
                        <div>
                          <button className="proj-toggle" onClick={() => setExpandedProj(isExpanded ? null : p.title)}>
                            {isExpanded ? "▲ Hide" : "▼ Show"} Architecture Diagram
                          </button>
                          {isExpanded && <MallNavDiagram />}
                        </div>
                      )}

                      <div className="metrics">{p.metrics.map(m => <span key={m} className="metric">{m}</span>)}</div>
                      <div className="stack">{p.stack.map(s => <span key={s} className="stag">{s}</span>)}</div>
                    </div>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* SKILLS — Gemini rec #4: Domain-grouped, no progress bars */}
      <div className="bg-alt" style={{ position: "relative", zIndex: 1 }}>
        <section id="skills">
          <div className="sec">
            <div className="eyebrow">04 — The Arsenal</div>
            <h2 className="sec-title">Tools &amp; Technologies Grouped<br /> by Domain</h2>
            <div className="skill-grid">
              {SKILLS.map((g, i) => (
                <Reveal key={g.cat} delay={i * 70}>
                  <div className="sg">
                    <div className="sg-head"><span>{g.icon}</span>{g.cat}</div>
                    <div className="chips">{g.items.map(item => <span key={item} className="chip">{item}</span>)}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* NOTES / BLOG — Gemini rec #5: Writing section proving communication skills */}
      <section id="notes">
        <div className="sec">
          <div className="eyebrow">05 — Notes from the Trenches</div>
          <h2 className="sec-title">Things I've Built,Broken &amp; Learned</h2>
          <p style={{ color: "var(--muted)", maxWidth: 460, margin: "0 auto", lineHeight: 1.88, fontSize: "0.96rem", fontFamily: "var(--fsub)", marginBottom: "1rem" }}>
            Writing is thinking out loud. These are posts I'm working on — explaining complex ideas I've had to figure out the hard way in production.
          </p>
          <div className="notes-grid">
            {BLOG_POSTS.map((post, i) => (
              <Reveal key={post.title} delay={i * 90}>
                <div className="note-card">
                  <span className="note-emoji">{post.emoji}</span>
                  <span className="note-tag">{post.tag}</span>
                  <div className="note-title">{post.title}</div>
                  <div className="note-desc">{post.desc}</div>
                  <div className="note-footer">
                    <span className="coming-soon">Coming Soon</span>
                    <span style={{ opacity: 0.5 }}>— Draft in progress</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <div className="bg-alt" style={{ position: "relative", zIndex: 1 }}>
        <section id="contact" style={{ textAlign: "center" }}>
          <div className="sec">
            <div className="divider">🌿</div>
            <div className="eyebrow" style={{ justifyContent: "center" }}>06 — Connect</div>
            <h2 className="sec-title" style={{ textAlign: "center" }}>Open to Roles &amp; Collaborations</h2>
            <p style={{ color: "var(--muted)", maxWidth: 460, margin: "0 auto", lineHeight: 1.88, fontSize: "0.96rem", fontFamily: "var(--fsub)" }}>
              Whether you're building a product from scratch, scaling an existing system, or need someone who takes full ownership — let's connect.
            </p>
            <div className="contact-links">
              {[
                { icon: "✉️", label: "bhimannavarsudeep26@gmail.com", href: "mailto:bhimannavarsudeep26@gmail.com" },
                { icon: "💼", label: "linkedin/sudeep-bhimannavar", href: "https://linkedin.com/in/sudeep-bhimannavar" },
                { icon: "🐙", label: "github/sudeepbhimannavar", href: "https://github.com/sudeepbhimannavar" },
                { icon: "📱", label: "+91-7760531692", href: "tel:+917760531692" },
              ].map(c => (
                <Reveal key={c.label}>
                  <a href={c.href} className="clink" target="_blank" rel="noopener noreferrer">
                    <span style={{ fontSize: "1.3rem" }}>{c.icon}</span><span>{c.label}</span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </div>

      <footer>
        <div style={{ marginBottom: "0.4rem" }}>🌿 &nbsp;<span className="fn">Sudeep Bhimannavar</span>&nbsp; 🌿</div>
        <div>Bengaluru, India · Full-Stack Engineer · Generative AI & SaaS · {new Date().getFullYear()}</div>
        <div className="shloka">सत्यमेव जयते — Truth alone triumphs</div>
      </footer>
    </>
  );
}