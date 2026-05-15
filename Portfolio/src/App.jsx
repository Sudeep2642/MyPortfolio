import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

/* ─── CONSTANTS / DATA ─────────────────────────────────────────────────────── */
const NAV = ["home", "about", "experience", "projects", "skills", "notes", "contact"];

const SKILLS = [
  { cat: "Languages", color: "#00c8ff", items: ["Python", "JavaScript ES6+", "Java", "C", "SQL", "HTML5", "CSS3"] },
  { cat: "Frameworks", color: "#7c6fff", items: ["Django", "Django REST", "React.js", "Next.js", "Node.js", "NetworkX", "OpenCV"] },
  { cat: "Databases & Cloud", color: "#00ffb3", items: ["MySQL", "PostgreSQL", "SQLite", "Firebase", "AWS", "Railway", "Docker"] },
  { cat: "AI / ML", color: "#ffd060", items: ["Claude Vision API", "Generative AI", "Computer Vision", "Dijkstra's Algorithm", "Graph Theory", "NLP"] },
  { cat: "Infrastructure", color: "#ff6b7a", items: ["Git", "GitHub", "Docker", "CI/CD", "Gunicorn", "WhiteNoise", "JWT", "TDD", "System Design", "Postman"] },
  { cat: "Accessibility", color: "#00c8ff", items: ["WCAG 2.1 AA", "ARIA Landmark Roles", "Semantic HTML", "Responsive Design"] },
];

const STATS = [
  { val: 50000, suffix: "+", label: "Daily API Requests", icon: "⚡", color: "#00c8ff" },
  { val: 10000, suffix: "+", label: "Daily Active Users", icon: "👥", color: "#7c6fff" },
  { val: 60, suffix: "%", label: "Query Latency Cut", icon: "🚀", color: "#00ffb3" },
  { val: 30, suffix: "%", label: "Engagement Lift", icon: "📈", color: "#ffd060" },
];

const PROJECTS = [
  {
    title: "MallNav",
    subtitle: "AI-Driven Indoor Navigation System",
    icon: "🧭", accent: "#00c8ff",
    stack: ["Python", "Django", "NetworkX", "OpenCV", "Claude Vision API", "Canvas API"],
    metrics: ["95% route accuracy", "1,000+ concurrent users", "90% setup time cut", "80% fewer tickets"],
    problem: "Mall operators spent 8+ hours manually mapping floor plans and annotating 50+ POIs per venue. Non-technical staff couldn't maintain maps, creating constant engineering bottlenecks.",
    solution: "Autonomous CV pipeline (Claude Vision API + OpenCV) parses architectural floor plans at 90% POI accuracy. Dijkstra's algorithm on dynamic weighted graphs powers multi-floor navigation. Custom JS Canvas API graph editor lets non-technical staff update maps in real time.",
    result: "Setup time: 8hrs → 45min (90% cut). 1,000+ concurrent users at 95% route accuracy. 80% reduction in engineering support tickets. Non-technical staff now fully own map maintenance.",
    showDiagram: true,
    period: "Feb 2026 – Present",
  },
  {
    title: "Formalls",
    subtitle: "Production Multi-Tenant SaaS Platform",
    icon: "🏢", accent: "#7c6fff",
    stack: ["Django", "React.js", "MySQL", "JWT", "Gunicorn", "WhiteNoise", "Docker"],
    metrics: ["10,000+ DAU", "50,000+ req/day", "30% engagement lift", "99.9% uptime"],
    problem: "Mall operators needed a unified platform managing 100+ stores, 20+ restaurants and 500+ daily bookings with strict cross-tenant data isolation and zero manual coordination overhead.",
    solution: "Normalised MySQL schemas with strict cross-tenant isolation. 5-tier JWT-based RBAC for 10K+ users. Real-time slot conflict detection, multi-channel notifications, collaborative filtering recommendation engine, Analytics Engine tracking footfall trends.",
    result: "10,000+ DAU, 50,000+ req/day at 99.9% uptime. 30% engagement lift & 25% higher avg transaction. 60% query latency cut. 45% fewer support tickets via WhatsApp automation.",
    showDiagram: false,
    period: "Jul 2025 – Present",
  },
];

const BLOG_POSTS = [
  { emoji: "⚡", tag: "Backend Engineering", accent: "#00c8ff", title: "How I Cut MySQL Query Latency by 60% in Production", desc: "The exact indexing strategies, query rewrites, and Gunicorn tuning that took analytical endpoints from sluggish to handling 50K+ req/day." },
  { emoji: "🏗️", tag: "System Design", accent: "#7c6fff", title: "Building Multi-Tenant SaaS with Django: Schema Isolation Done Right", desc: "Normalised MySQL schemas with strict cross-tenant isolation for 5+ enterprise clients — middleware choices, RBAC architecture, and pitfalls to avoid." },
  { emoji: "🧠", tag: "AI / Computer Vision", accent: "#00ffb3", title: "Claude Vision API + OpenCV: Parsing Floor Plans at 90% Accuracy", desc: "How I built an autonomous POI classification pipeline that reads architectural floor plans and slashed setup time from 8 hours to 45 minutes." },
  { emoji: "🗺️", tag: "Graph Theory", accent: "#ffd060", title: "Dijkstra's Algorithm on Dynamic Graphs: Indoor Navigation in Practice", desc: "Turning weighted graphs into real-time multi-floor pathfinding — edge-weight updates, node snapping in the Canvas API, keeping graphs accurate as venues evolve." },
];

const INTERESTS = [
  { emoji: "🏎️", label: "Formula 1" },
  { emoji: "🎌", label: "Anime" },
  { emoji: "📚", label: "Crime & Mystery" },
  { emoji: "🔍", label: "Robert Langdon" },
  { emoji: "🌿", label: "Nature Walks" },
];

/* ─── 3D HERO SCENE (Three.js) ─────────────────────────────────────────────── */
function HeroScene() {
  const mountRef = useRef(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const W = mount.clientWidth, H = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.z = 3.5;

    /* Core globe */
    const sphereGeo = new THREE.SphereGeometry(1, 72, 72);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x050e20, emissive: 0x081830,
      specular: 0x1a4466, shininess: 60,
      transparent: true, opacity: 0.97,
    });
    const globe = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(globe);

    /* Lat/lon grid lines */
    const gridMat = new THREE.LineBasicMaterial({ color: 0x00c8ff, transparent: true, opacity: 0.07 });
    for (let lat = -80; lat <= 80; lat += 20) {
      const r = Math.cos((lat * Math.PI) / 180);
      const y = Math.sin((lat * Math.PI) / 180);
      const pts = [];
      for (let i = 0; i <= 64; i++) {
        const a = (i / 64) * Math.PI * 2;
        pts.push(new THREE.Vector3(r * Math.cos(a), y, r * Math.sin(a)));
      }
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
    }
    for (let lon = 0; lon < 360; lon += 30) {
      const pts = [];
      for (let i = 0; i <= 64; i++) {
        const lat = -90 + (i / 64) * 180;
        const a = (lon * Math.PI) / 180;
        const r = Math.cos((lat * Math.PI) / 180);
        const y = Math.sin((lat * Math.PI) / 180);
        pts.push(new THREE.Vector3(r * Math.cos(a), y, r * Math.sin(a)));
      }
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
    }

    /* Glowing atmosphere shells */
    const atmColors = [0x00c8ff, 0x7c6fff, 0x00ffb3];
    const atmAlphas = [0.07, 0.04, 0.025];
    atmColors.forEach((c, i) => {
      const m = new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: atmAlphas[i], side: THREE.BackSide });
      scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.1 + i * 0.1, 32, 32), m));
    });

    /* Orbit rings */
    const ringDefs = [
      { r: 1.42, thick: 0.005, color: 0x00c8ff, alpha: 0.4, rx: Math.PI / 2.2, ry: 0, rz: 0.4, speed: 0.007 },
      { r: 1.68, thick: 0.004, color: 0x7c6fff, alpha: 0.28, rx: Math.PI / 3, ry: 0, rz: -0.6, speed: -0.005 },
      { r: 1.95, thick: 0.003, color: 0x00ffb3, alpha: 0.18, rx: Math.PI / 1.6, ry: 0, rz: 1.2, speed: 0.003 },
    ];
    const rings = ringDefs.map(d => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(d.r, d.thick, 8, 140),
        new THREE.MeshBasicMaterial({ color: d.color, transparent: true, opacity: d.alpha })
      );
      m.rotation.set(d.rx, d.ry, d.rz);
      m.userData.speed = d.speed;
      scene.add(m);
      return m;
    });

    /* Orbiting nodes */
    const nodeColors = [0x00c8ff, 0x7c6fff, 0x00ffb3, 0xffd060, 0xff6b7a, 0x00c8ff];
    const nodes = ringDefs.flatMap((d, ri) =>
      [0, 1].map(ni => {
        const node = new THREE.Mesh(
          new THREE.SphereGeometry(0.028, 10, 10),
          new THREE.MeshBasicMaterial({ color: nodeColors[ri * 2 + ni] })
        );
        node.userData = { r: d.r, angle: (ri * 2 + ni) * 1.05, speed: d.speed * 0.95, rx: d.rx, rz: d.rz };
        scene.add(node);
        return node;
      })
    );

    /* POI dots on globe surface */
    const dotPositions = [
      [0.3, 0.8, 0.52], [-0.6, 0.5, 0.62], [0.7, -0.4, 0.59],
      [-0.2, -0.7, 0.68], [0.9, 0.2, 0.38], [-0.85, -0.3, 0.43],
    ];
    dotPositions.forEach(([x, y, z]) => {
      const len = Math.sqrt(x * x + y * y + z * z);
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.018, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x00c8ff })
      );
      dot.position.set(x / len * 1.02, y / len * 1.02, z / len * 1.02);
      globe.add(dot);
    });

    /* Stars */
    const starPos = new Float32Array(600 * 3);
    for (let i = 0; i < 600 * 3; i++) starPos[i] = (Math.random() - 0.5) * 35;
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.022, transparent: true, opacity: 0.55 })));

    /* Lights */
    scene.add(new THREE.AmbientLight(0x05102a, 3));
    const lights = [
      { color: 0x00c8ff, intensity: 4, pos: [3, 2, 2] },
      { color: 0x7c6fff, intensity: 2.5, pos: [-3, -1, 1.5] },
      { color: 0x00ffb3, intensity: 1.5, pos: [0, 3, -2] },
    ];
    const ptLights = lights.map(l => {
      const pl = new THREE.PointLight(l.color, l.intensity, 12);
      pl.position.set(...l.pos);
      scene.add(pl);
      return pl;
    });

    /* Mouse interaction */
    let targetX = 0, targetY = 0;
    const onMouse = (e) => {
      const rect = mount.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.6;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.5;
    };
    window.addEventListener("mousemove", onMouse);

    const onResize = () => {
      const nW = mount.clientWidth, nH = mount.clientHeight;
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
      renderer.setSize(nW, nH);
    };
    window.addEventListener("resize", onResize);

    let t = 0, animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.008;

      globe.rotation.y += 0.0025;
      camera.position.x += (targetX * 0.5 - camera.position.x) * 0.04;
      camera.position.y += (-targetY * 0.3 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      rings.forEach(r => { r.rotation.z += r.userData.speed; });
      nodes.forEach(n => {
        n.userData.angle += n.userData.speed;
        const a = n.userData.angle;
        const r = n.userData.r;
        const rx = n.userData.rx, rz = n.userData.rz;
        const x0 = r * Math.cos(a), y0 = 0, z0 = r * Math.sin(a);
        // Apply same rotation as the ring
        n.position.set(
          x0 * Math.cos(rz) - y0 * Math.sin(rz),
          x0 * Math.sin(rz) * Math.sin(rx) + y0 * Math.cos(rx),
          z0
        );
      });

      ptLights[0].intensity = 4 + Math.sin(t * 1.1) * 1;
      ptLights[1].intensity = 2.5 + Math.sin(t * 0.8 + 1) * 0.6;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%", cursor: "crosshair" }} />;
}

/* ─── PARTICLE BACKGROUND ───────────────────────────────────────────────────── */
function ParticleBG() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let mx = W / 2, my = H / 2;

    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 1.4 + 0.4, opacity: Math.random() * 0.45 + 0.08,
    }));

    const onMouse = (e) => { mx = e.clientX; my = e.clientY; };
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("resize", onResize);

    let id;
    const frame = () => {
      id = requestAnimationFrame(frame);
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        const dx = mx - p.x, dy = my - p.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) { p.vx -= (dx / d) * 0.018; p.vy -= (dy / d) * 0.018; }
        p.vx *= 0.988; p.vy *= 0.988;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,200,255,${p.opacity})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,200,255,${0.11 * (1 - d / 100)})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
    };
    frame();
    return () => { cancelAnimationFrame(id); window.removeEventListener("mousemove", onMouse); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

/* ─── TYPEWRITER ────────────────────────────────────────────────────────────── */
function Typewriter({ strings }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = strings[idx % strings.length];
    const timer = setTimeout(() => {
      if (!del) {
        setText(cur.slice(0, text.length + 1));
        if (text.length + 1 === cur.length) setTimeout(() => setDel(true), 1800);
      } else {
        setText(cur.slice(0, text.length - 1));
        if (text.length - 1 === 0) { setDel(false); setIdx(i => i + 1); }
      }
    }, del ? 42 : 82);
    return () => clearTimeout(timer);
  }, [text, del, idx, strings]);
  return <span>{text}<span className="cblink">|</span></span>;
}

/* ─── SCROLL REVEAL ─────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, from = "bottom" }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.06 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const tf = vis ? "none" : from === "left" ? "translateX(-55px)" : from === "right" ? "translateX(55px)" : "translateY(48px)";
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: tf, transition: `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─── TILT CARD ─────────────────────────────────────────────────────────────── */
function TiltCard({ children, intensity = 12 }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * intensity;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -intensity;
    ref.current.style.transform = `perspective(1100px) rotateX(${y}deg) rotateY(${x}deg) scale3d(1.02,1.02,1.02)`;
  };
  const onLeave = () => { ref.current.style.transform = "perspective(1100px) rotateX(0) rotateY(0) scale3d(1,1,1)"; };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ transition: "transform 0.22s ease", transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}

/* ─── COUNTER ───────────────────────────────────────────────────────────────── */
function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const fired = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !fired.current) {
        fired.current = true;
        let s = 0; const step = target / 75;
        const t = setInterval(() => {
          s += step;
          if (s >= target) { setVal(target); clearInterval(t); }
          else setVal(Math.floor(s));
        }, 14);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ─── MALLNAV DIAGRAM ───────────────────────────────────────────────────────── */
const MallNavDiagram = () => {
  const nodes = [
    { x: 65, label: "Floor Plan", sub: "Image Input", color: "#00c8ff", icon: "📐" },
    { x: 215, label: "Claude Vision", sub: "API + OpenCV", color: "#7c6fff", icon: "🧠" },
    { x: 365, label: "Dijkstra", sub: "Pathfinding", color: "#00ffb3", icon: "🗺️" },
    { x: 515, label: "QR → Map", sub: "User UI", color: "#ffd060", icon: "📱" },
  ];
  return (
    <svg viewBox="0 0 580 210" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", maxWidth: 580, margin: "1.6rem 0", borderRadius: 10, background: "rgba(4,8,15,0.7)", border: "1px solid rgba(0,200,255,0.13)" }}>
      <defs>
        {nodes.map((n, i) => <filter key={i} id={`gf${i}`}><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>)}
      </defs>
      {/* connector lines */}
      {[0, 1, 2].map(i => (
        <g key={i}>
          <line x1={nodes[i].x + 50} y1={100} x2={nodes[i + 1].x - 50} y2={100}
            stroke={nodes[i].color} strokeWidth="1.2" strokeDasharray="5 4" opacity="0.45" />
          <polygon points={`${nodes[i + 1].x - 52},96 ${nodes[i + 1].x - 44},100 ${nodes[i + 1].x - 52},104`} fill={nodes[i + 1].color} opacity="0.7" />
        </g>
      ))}
      {/* nodes */}
      {nodes.map((n, i) => (
        <g key={i}>
          <rect x={n.x - 55} y={68} width={110} height={64} rx="8"
            fill="rgba(8,16,30,0.9)" stroke={n.color} strokeWidth="1" strokeOpacity="0.5" filter={`url(#gf${i})`} />
          <text x={n.x} y={90} textAnchor="middle" fontSize="18">{n.icon}</text>
          <text x={n.x} y={112} textAnchor="middle" fill={n.color} fontSize="10" fontWeight="700" fontFamily="Space Grotesk, sans-serif">{n.label}</text>
          <text x={n.x} y={126} textAnchor="middle" fill="rgba(160,200,235,0.5)" fontSize="9" fontFamily="Space Grotesk, sans-serif">{n.sub}</text>
        </g>
      ))}
      {/* metric pills */}
      {[
        { x: 65, label: "90% Accuracy", color: "#00c8ff" },
        { x: 215, label: "45min Setup", color: "#7c6fff" },
        { x: 365, label: "1K+ Users", color: "#00ffb3" },
        { x: 515, label: "95% Routes", color: "#ffd060" },
      ].map((m, i) => (
        <g key={i}>
          <rect x={m.x - 42} y={152} width={84} height={22} rx="4" fill={m.color} fillOpacity="0.1" stroke={m.color} strokeOpacity="0.3" strokeWidth="1" />
          <text x={m.x} y={167} textAnchor="middle" fill={m.color} fontSize="9.5" fontWeight="700" fontFamily="JetBrains Mono, monospace">{m.label}</text>
        </g>
      ))}
      <text x="290" y="198" textAnchor="middle" fill="rgba(255,255,255,0.18)" fontSize="8" fontFamily="JetBrains Mono, monospace" fontStyle="italic">MallNav · System Architecture</text>
    </svg>
  );
};

/* ─── GRID NOISE TEXTURE ────────────────────────────────────────────────────── */
const GridBG = () => (
  <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: "linear-gradient(rgba(0,200,255,0.024) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,0.024) 1px, transparent 1px)",
      backgroundSize: "60px 60px",
    }} />
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,200,255,0.06) 0%, transparent 65%)" }} />
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 40% at 80% 100%, rgba(124,111,255,0.05) 0%, transparent 55%)" }} />
  </div>
);

/* ─── MAIN APP ───────────────────────────────────────────────────────────────── */
export default function Portfolio() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expandedProj, setExpandedProj] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.22 }
    );
    NAV.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  const css = `
    /* KEYFRAMES */
    @keyframes float     { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-16px) rotate(.8deg)} }
    @keyframes pulse-glow{ 0%,100%{box-shadow:0 0 22px rgba(0,200,255,.3),0 0 0 14px rgba(0,200,255,.04)} 50%{box-shadow:0 0 55px rgba(0,200,255,.55),0 0 0 14px rgba(0,200,255,.07)} }
    @keyframes spin-slow { to{transform:rotate(360deg)} }
    @keyframes fadeUp    { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:none} }
    @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes borderGlow{ 0%,100%{border-color:rgba(0,200,255,.15)} 50%{border-color:rgba(0,200,255,.45)} }

    .cblink { animation:blink 1s step-end infinite; color:var(--cyan); }

    /* SCROLLBAR */
    ::-webkit-scrollbar{width:4px}
    ::-webkit-scrollbar-track{background:var(--bg2)}
    ::-webkit-scrollbar-thumb{background:linear-gradient(var(--cyan),var(--purple));border-radius:2px}

    /* NAV */
    nav {
      position:fixed; top:0; left:0; right:0; z-index:500;
      display:flex; align-items:center; justify-content:space-between;
      padding:0 3.5rem; height:66px;
      transition:all .4s;
    }
    nav.scrolled {
      background:rgba(4,8,15,.94);
      backdrop-filter:blur(22px) saturate(160%);
      border-bottom:1px solid var(--border);
      box-shadow:0 8px 32px rgba(0,200,255,.04);
    }
    .nav-logo {
      font-family:var(--fhead); font-size:1.22rem; font-weight:800; letter-spacing:.05em;
      background:linear-gradient(135deg,var(--cyan),var(--purple));
      -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
      cursor:pointer;
    }
    .nav-links { display:flex; gap:2.8rem; list-style:none; align-items:center; }
    .nav-links a {
      font-family:var(--fmono); font-size:.68rem; font-weight:400;
      letter-spacing:.2em; text-transform:uppercase;
      color:var(--stone); text-decoration:none;
      transition:color .25s; position:relative;
    }
    .nav-links a::after {
      content:''; position:absolute; bottom:-4px; left:0;
      width:0; height:1px; background:var(--cyan); transition:width .28s;
    }
    .nav-links a:hover,.nav-links a.active { color:var(--cyan); }
    .nav-links a:hover::after,.nav-links a.active::after { width:100%; }
    .nav-btn {
      font-family:var(--fmono); font-size:.66rem; font-weight:500;
      letter-spacing:.16em; text-transform:uppercase;
      padding:.48rem 1.3rem; border-radius:3px;
      background:transparent; color:var(--cyan);
      border:1px solid rgba(0,200,255,.5); text-decoration:none;
      transition:all .25s; position:relative; overflow:hidden;
    }
    .nav-btn::before { content:''; position:absolute; inset:0; background:var(--cyan); transform:translateX(-101%); transition:transform .25s; z-index:-1; }
    .nav-btn:hover { color:var(--bg); }
    .nav-btn:hover::before { transform:translateX(0); }
    .hamburger { display:none; flex-direction:column; gap:5px; cursor:pointer; padding:6px; }
    .hamburger span { width:22px; height:1.5px; background:var(--cyan); display:block; transition:all .3s; }

    /* MOBILE MENU */
    .mob-overlay {
      position:fixed; inset:0; z-index:450;
      background:rgba(4,8,15,.97); backdrop-filter:blur(20px);
      display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2.2rem;
    }
    .mob-overlay a {
      font-family:var(--fhead); font-size:1.4rem; font-weight:700;
      letter-spacing:.04em; color:var(--muted); text-decoration:none; transition:color .2s;
    }
    .mob-overlay a:hover { color:var(--cyan); }

    /* HERO */
    #home {
      min-height:100vh; display:flex; align-items:center;
      padding:6rem 5rem 4rem 6rem; gap:2rem; flex-wrap:wrap;
      position:relative; overflow:hidden;
    }
    .hero-left { flex:1; min-width:300px; max-width:620px; position:relative; z-index:2; }
    .hero-right { flex:0 0 480px; height:480px; position:relative; z-index:1; }

    .hero-tag {
      font-family:var(--fmono); font-size:.7rem; color:var(--cyan);
      letter-spacing:.28em; text-transform:uppercase; margin-bottom:1.5rem;
      display:flex; align-items:center; gap:.8rem;
      opacity:0; animation:fadeUp .8s .2s forwards;
    }
    .hero-tag-line { width:38px; height:1px; background:rgba(0,200,255,.45); }

    h1.hero-name {
      font-family:var(--fhead); font-size:clamp(3rem,3.5vw,6.2rem);
      font-weight:800; line-height:1.0; margin-bottom:.7rem;
      background:linear-gradient(150deg,#ffffff 0%,var(--cyan) 48%,var(--purple) 100%);
      -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
      opacity:0; animation:fadeUp .9s .4s forwards;
    }
    .hero-type {
      font-family:var(--fmono); font-size:clamp(1rem,2.2vw,1.35rem);
      color:var(--cyan); margin-bottom:1.8rem; min-height:2.4rem;
      opacity:0; animation:fadeUp .9s .6s forwards;
    }
    .hero-desc {
      font-size:.98rem; line-height:1.94; color:var(--muted); margin-bottom:2.6rem;
      max-width:520px; border-left:2px solid rgba(0,200,255,.22); padding-left:1.5rem;
      opacity:0; animation:fadeUp .9s .8s forwards;
    }
    .hero-desc strong { color:var(--cyan); font-weight:600; }
    .hero-cta {
      display:flex; gap:1rem; flex-wrap:wrap; align-items:center;
      opacity:0; animation:fadeUp .9s 1s forwards;
    }

    /* BUTTONS */
    .btn {
      font-family:var(--fmono); font-size:.7rem; font-weight:500;
      letter-spacing:.16em; text-transform:uppercase;
      padding:.88rem 2.2rem; border-radius:3px; cursor:pointer;
      transition:all .26s; text-decoration:none;
      display:inline-flex; align-items:center; gap:.5rem;
      position:relative; overflow:hidden;
    }
    .btn-pri {
      color:var(--bg);
      background:linear-gradient(135deg,var(--cyan),var(--purple));
      border:1px solid transparent;
    }
    .btn-pri:hover { transform:translate(-3px,-3px); box-shadow:6px 6px 0 var(--cyan2); }
    .btn-sec {
      background:transparent; color:var(--purple); border:1px solid var(--purple);
    }
    .btn-sec:hover { background:rgba(124,111,255,.1); transform:translate(-2px,-2px); box-shadow:4px 4px 0 var(--purple2); }

    /* STATS */
    .stats-row {
      display:grid; grid-template-columns:repeat(4,1fr);
      background:var(--bg2);
      border-top:1px solid var(--border); border-bottom:1px solid var(--border);
      position:relative; z-index:2;
    }
    .stat-cell {
      padding:3rem 1.5rem; text-align:center;
      border-right:1px solid var(--border);
      position:relative; overflow:hidden; transition:background .3s;
    }
    .stat-cell:last-child { border-right:none; }
    .stat-cell::before {
      content:''; position:absolute; top:0; left:0; right:0; height:2px;
      background:linear-gradient(90deg,transparent,var(--s-color,var(--cyan)),transparent);
      opacity:.7;
    }
    .stat-cell:hover { background:rgba(0,200,255,.03); }
    .stat-icon { font-size:1.5rem; margin-bottom:.7rem; display:block; }
    .stat-val {
      font-family:var(--fhead); font-size:3rem; font-weight:800; line-height:1; margin-bottom:.45rem;
    }
    .stat-lbl {
      font-family:var(--fmono); font-size:.63rem; letter-spacing:.2em; text-transform:uppercase; color:var(--stone);
    }

    /* SECTION */
    .sec { padding:7rem 5rem; position:relative; z-index:1; max-width:1300px; margin:0 auto; }
    .eyebrow {
      display:flex; align-items:center; gap:.7rem;
      font-family:var(--fmono); font-size:.63rem; letter-spacing:.3em; text-transform:uppercase;
      color:var(--cyan); margin-bottom:1rem;
    }
    .eyebrow-num { color:var(--purple); }
    .sec-title {
      font-family:var(--fhead); font-size:clamp(2rem,4.5vw,3.6rem);
      font-weight:800; color:var(--text); line-height:1.1; margin-bottom:4rem;
    }
    .sec-title em {
      font-style:normal;
      background:linear-gradient(135deg,var(--cyan),var(--purple));
      -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
    }
    .bg-alt { background:var(--bg2); border-top:1px solid var(--border); border-bottom:1px solid var(--border); }

    /* ABOUT */
    .about-grid { display:grid; grid-template-columns:1fr 1.65fr; gap:6rem; align-items:center; }
    .avatar-shell {
      width:280px; height:280px; border-radius:50%; margin:0 auto;
      background:radial-gradient(circle at 32% 28%,rgba(0,200,255,.18),rgba(124,111,255,.28),rgba(4,8,15,.96));
      border:1px solid rgba(0,200,255,.28);
      display:flex; align-items:center; justify-content:center;
      animation:float 6s ease-in-out infinite,pulse-glow 4.5s ease-in-out infinite;
      position:relative;
    }
    .avatar-shell::before {
      content:''; position:absolute; width:320px; height:320px; border-radius:50%;
      border:1px dashed rgba(0,200,255,.1); animation:spin-slow 22s linear infinite;
    }
    .avatar-shell::after {
      content:''; position:absolute; width:365px; height:365px; border-radius:50%;
      border:1px dashed rgba(124,111,255,.08); animation:spin-slow 34s linear infinite reverse;
    }
    .avatar-init {
      font-family:var(--fhead); font-size:5rem; font-weight:800;
      background:linear-gradient(135deg,var(--cyan),var(--purple));
      -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
    }
    .about-p { font-size:.98rem; line-height:1.96; color:var(--muted); margin-bottom:1.2rem; }
    .about-p strong { color:var(--cyan); font-weight:600; }
    .edu-card {
      margin-top:.8rem; padding:1.2rem 1.5rem;
      border-left:2px solid var(--edu-color,var(--cyan));
      background:rgba(0,200,255,.04); border-radius:0 6px 6px 0; position:relative;
    }
    .edu-card::before { content:''; position:absolute; inset:0; border-radius:0 6px 6px 0; background:linear-gradient(135deg,rgba(0,200,255,.03),transparent); }
    .edu-deg { font-weight:600; font-size:.9rem; color:var(--text); margin-bottom:.25rem; }
    .edu-school { font-size:.83rem; color:var(--cyan); }
    .edu-period { font-family:var(--fmono); font-size:.7rem; color:var(--stone); margin-top:.22rem; }
    .interests-row { display:flex; flex-wrap:wrap; gap:.75rem; margin-top:1.8rem; }
    .i-pill {
      display:flex; align-items:center; gap:.5rem; padding:.5rem 1rem;
      border-radius:40px; background:rgba(255,255,255,.03);
      border:1px solid var(--border); font-size:.83rem; color:var(--muted);
      transition:all .22s; cursor:default;
    }
    .i-pill:hover { border-color:rgba(0,200,255,.35); color:var(--cyan); background:rgba(0,200,255,.06); transform:translateY(-2px); }

    /* TIMELINE */
    .timeline { position:relative; padding-left:2.5rem; }
    .timeline::before {
      content:''; position:absolute; left:0; top:8px; bottom:0; width:1px;
      background:linear-gradient(to bottom,var(--cyan),var(--purple),transparent);
    }
    .t-item { position:relative; margin-bottom:3.5rem; }
    .t-dot {
      position:absolute; left:-2.88rem; top:6px;
      width:14px; height:14px; border-radius:50%;
      background:var(--bg2); border:2px solid var(--cyan);
      box-shadow:0 0 14px var(--cyan),0 0 28px rgba(0,200,255,.25);
    }
    .t-role { font-family:var(--fhead); font-size:1.5rem; font-weight:700; color:var(--text); }
    .t-company { font-family:var(--fmono); font-size:.85rem; color:var(--cyan); margin:.28rem 0 .18rem; }
    .t-meta { font-family:var(--fmono); font-size:.7rem; color:var(--stone); letter-spacing:.07em; margin-bottom:1.5rem; }
    .t-bullets { list-style:none; }
    .t-bullets li {
      font-size:.9rem; line-height:1.82; color:var(--muted);
      padding:.6rem 0 .6rem 1.7rem; border-bottom:1px solid rgba(0,200,255,.05); position:relative;
    }
    .t-bullets li::before { content:'▹'; position:absolute; left:0; color:var(--cyan); font-size:.8rem; top:.72rem; }
    .t-bullets li strong { color:var(--text); font-weight:600; }

    /* PROJECTS */
    .proj-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(555px,1fr)); gap:2rem; }
    .proj-card {
      background:var(--panel); border:1px solid var(--border);
      border-radius:14px; padding:2.6rem; position:relative; overflow:hidden;
      backdrop-filter:blur(12px); transition:all .35s;
      animation:borderGlow 6s ease-in-out infinite;
    }
    .proj-card::before {
      content:''; position:absolute; top:0; left:0; right:0; height:2px;
      background:linear-gradient(90deg,var(--p-accent,var(--cyan)),var(--purple),transparent);
    }
    .proj-card::after {
      content:''; position:absolute; inset:0; border-radius:14px;
      background:radial-gradient(circle at var(--mx,50%) var(--my,50%),rgba(0,200,255,.07) 0%,transparent 62%);
      opacity:0; transition:opacity .3s; pointer-events:none;
    }
    .proj-card:hover::after { opacity:1; }
    .proj-card:hover { border-color:rgba(0,200,255,.3); box-shadow:0 24px 64px rgba(0,200,255,.08); transform:translateY(-5px); }
    .proj-top { display:flex; align-items:flex-start; gap:1.3rem; margin-bottom:1.4rem; }
    .proj-icon {
      width:56px; height:56px; border-radius:11px; flex-shrink:0;
      background:rgba(0,200,255,.07); border:1px solid var(--border);
      display:flex; align-items:center; justify-content:center; font-size:1.8rem;
    }
    .proj-title { font-family:var(--fhead); font-size:1.55rem; font-weight:700; color:var(--text); }
    .proj-sub { font-family:var(--fmono); font-size:.72rem; color:var(--stone); margin-top:.22rem; letter-spacing:.04em; }
    .proj-period { font-family:var(--fmono); font-size:.65rem; color:var(--cyan); margin-top:.15rem; opacity:.7; }
    .psr { display:grid; grid-template-columns:1fr 1fr 1fr; margin:1.4rem 0; border:1px solid var(--border); border-radius:8px; overflow:hidden; }
    .psr-cell { padding:1.1rem 1.15rem; }
    .psr-cell:nth-child(2) { border-left:1px solid var(--border); border-right:1px solid var(--border); }
    .psr-label { font-family:var(--fmono); font-size:.58rem; font-weight:500; letter-spacing:.22em; text-transform:uppercase; margin-bottom:.5rem; }
    .psr-text { font-size:.82rem; line-height:1.68; color:var(--muted); }
    .psr-cell:nth-child(1) { background:rgba(255,107,122,.04); }
    .psr-cell:nth-child(2) { background:rgba(0,200,255,.04); }
    .psr-cell:nth-child(3) { background:rgba(0,255,179,.04); }
    .psr-cell:nth-child(1) .psr-label { color:var(--red); }
    .psr-cell:nth-child(2) .psr-label { color:var(--cyan); }
    .psr-cell:nth-child(3) .psr-label { color:var(--green); }
    .metrics { display:flex; flex-wrap:wrap; gap:.5rem; margin:1.3rem 0; }
    .metric {
      font-family:var(--fmono); font-size:.64rem; font-weight:500;
      letter-spacing:.1em; padding:.3rem .9rem; border-radius:3px;
      background:rgba(0,200,255,.06); border:1px solid rgba(0,200,255,.2); color:var(--cyan);
    }
    .stack { display:flex; flex-wrap:wrap; gap:.4rem; margin-top:1rem; }
    .stag {
      font-family:var(--fmono); font-size:.7rem; padding:.25rem .75rem;
      border-radius:3px; background:rgba(124,111,255,.08); border:1px solid rgba(124,111,255,.18); color:var(--purple);
    }
    .proj-toggle {
      background:none; border:1px solid var(--border); cursor:pointer;
      font-family:var(--fmono); font-size:.66rem; color:var(--cyan);
      letter-spacing:.1em; text-transform:uppercase;
      padding:.5rem 1rem; border-radius:3px; margin-top:1rem;
      transition:all .2s; display:flex; align-items:center; gap:.4rem;
    }
    .proj-toggle:hover { background:rgba(0,200,255,.08); border-color:var(--cyan); }

    /* SKILLS */
    .skill-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(340px,1fr)); gap:1.6rem; }
    .sg {
      background:var(--panel); border:1px solid var(--border); border-radius:10px; padding:1.8rem;
      backdrop-filter:blur(10px); transition:all .3s; position:relative; overflow:hidden;
    }
    .sg::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,var(--sg-c,var(--cyan)),transparent); }
    .sg:hover { border-color:rgba(0,200,255,.22); transform:translateY(-3px); }
    .sg-head {
      display:flex; align-items:center; gap:.6rem;
      font-family:var(--fmono); font-size:.63rem; font-weight:500;
      letter-spacing:.22em; text-transform:uppercase; margin-bottom:1.3rem;
    }
    .chips { display:flex; flex-wrap:wrap; gap:.45rem; }
    .chip {
      font-size:.8rem; padding:.36rem .78rem; border-radius:4px;
      background:rgba(255,255,255,.04); border:1px solid var(--border); color:var(--muted);
      transition:all .22s; cursor:default;
    }
    .chip:hover { background:rgba(0,200,255,.1); color:var(--cyan); border-color:rgba(0,200,255,.35); transform:translateY(-2px); box-shadow:0 4px 14px rgba(0,200,255,.15); }

    /* BLOG */
    .notes-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(390px,1fr)); gap:1.8rem; }
    .note-card {
      background:var(--panel); border:1px solid var(--border); border-radius:10px; padding:2rem;
      backdrop-filter:blur(10px); transition:all .3s; position:relative; overflow:hidden;
    }
    .note-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,var(--nc-c,var(--cyan)),transparent); }
    .note-card:hover { transform:translate(-3px,-3px); box-shadow:6px 6px 0 rgba(0,200,255,.12); border-color:rgba(0,200,255,.22); }
    .note-tag {
      font-family:var(--fmono); font-size:.59rem; font-weight:500;
      letter-spacing:.2em; text-transform:uppercase; color:var(--cyan);
      background:rgba(0,200,255,.07); border:1px solid rgba(0,200,255,.18);
      border-radius:3px; padding:.2rem .65rem; display:inline-block; margin-bottom:1rem;
    }
    .note-emoji { font-size:2rem; margin-bottom:.8rem; display:block; }
    .note-title { font-family:var(--fhead); font-size:1.08rem; font-weight:700; color:var(--text); margin-bottom:.7rem; line-height:1.35; }
    .note-desc { font-size:.87rem; line-height:1.78; color:var(--muted); }
    .note-footer { margin-top:1.4rem; font-family:var(--fmono); font-size:.65rem; color:var(--stone); display:flex; align-items:center; gap:.5rem; }
    .coming-soon { background:rgba(255,208,96,.08); border:1px solid rgba(255,208,96,.28); color:var(--gold); border-radius:3px; padding:.18rem .55rem; }

    /* CONTACT */
    .contact-grid { display:flex; flex-wrap:wrap; gap:1rem; justify-content:center; margin-top:3rem; }
    .clink {
      display:flex; align-items:center; gap:.85rem;
      padding:1rem 1.9rem; border-radius:8px; background:var(--panel);
      border:1px solid var(--border); color:var(--muted); text-decoration:none;
      transition:all .3s; font-size:.9rem; backdrop-filter:blur(10px); position:relative; overflow:hidden;
    }
    .clink::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(0,200,255,.07),rgba(124,111,255,.07)); opacity:0; transition:opacity .3s; }
    .clink:hover { color:var(--cyan); border-color:rgba(0,200,255,.38); transform:translateY(-3px); box-shadow:0 12px 34px rgba(0,200,255,.1); }
    .clink:hover::before { opacity:1; }
    .clink-icon { font-size:1.1rem; color:var(--cyan); }

    /* FOOTER */
    footer {
      text-align:center; padding:3rem 2rem; color:var(--stone);
      font-family:var(--fmono); font-size:.74rem; letter-spacing:.09em;
      border-top:1px solid var(--border); position:relative; z-index:1;
    }
    .fn { color:var(--cyan); font-family:var(--fhead); font-size:.95rem; font-weight:700; }
    .shloka { font-size:.78rem; color:rgba(0,200,255,.28); margin-top:.6rem; letter-spacing:.1em; }

    /* RESPONSIVE */
    @media(max-width:960px){
      nav { padding:0 1.8rem; }
      .nav-links,.nav-btn { display:none; }
      .hamburger { display:flex; }
      #home { padding:5rem 2rem 3rem; }
      .hero-right { flex:0 0 100%; height:320px; order:-1; }
      .sec { padding:5rem 1.8rem; }
      .about-grid { grid-template-columns:1fr; gap:3rem; }
      .stats-row { grid-template-columns:repeat(2,1fr); }
      .proj-grid { grid-template-columns:1fr; }
      .psr { grid-template-columns:1fr; }
      .psr-cell:nth-child(2) { border-left:none; border-right:none; border-top:1px solid var(--border); border-bottom:1px solid var(--border); }
      .notes-grid { grid-template-columns:1fr; }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <GridBG />
      <ParticleBG />

      {/* NAV */}
      <nav className={scrolled ? "scrolled" : ""}>
        <div className="nav-logo" onClick={() => scrollTo("home")}>SB_DEV</div>
        <ul className="nav-links">
          {NAV.map(id => (
            <li key={id}>
              <a href={`#${id}`} className={active === id ? "active" : ""}
                onClick={e => { e.preventDefault(); scrollTo(id); }}>
                {id}
              </a>
            </li>
          ))}
        </ul>
        <a href="/Sudeep_Bhimannavar_Software_Engineer.pdf" className="nav-btn" download>↓ Resume</a>
        <div className="hamburger" onClick={() => setMenuOpen(true)}>
          <span /><span /><span />
        </div>
      </nav>

      {menuOpen && (
        <div className="mob-overlay">
          {NAV.map(id => (
            <a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id); }}>{id}</a>
          ))}
          <button onClick={() => setMenuOpen(false)}
            style={{ fontFamily: "var(--fmono)", fontSize: ".7rem", color: "var(--stone)", background: "none", border: "1px solid var(--border)", padding: ".5rem 1.2rem", borderRadius: "3px", cursor: "pointer", letterSpacing: ".12em", marginTop: "1rem" }}>
            [ CLOSE ]
          </button>
        </div>
      )}

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section id="home">
        <div className="hero-left">
          <div className="hero-tag">
            <span className="hero-tag-line" />
            Full-Stack Engineer · Bengaluru, India
          </div>
          <h1 className="hero-name">Sudeep<br />Bhimannavar</h1>
          <div className="hero-type">
            <Typewriter strings={[
              "Building AI-Powered SaaS",
              "React.js · Django · OpenCV",
              "10K+ DAU · 50K+ req/day",
              "Claude Vision API Engineer",
              "Scalable Systems Architect",
            ]} />
          </div>
          <p className="hero-desc">
            Frontend-focused full-stack engineer shipping production systems at real scale. Architected <strong>Formalls</strong> — multi-tenant SaaS serving 10,000+ DAU at 99.9% uptime — and <strong>MallNav</strong>, an AI indoor navigation system using Claude Vision API + OpenCV at 90% accuracy.
          </p>
          <div className="hero-cta">
            <a href="#projects" className="btn btn-pri" onClick={e => { e.preventDefault(); scrollTo("projects"); }}>View My Work →</a>
            <a href="#contact" className="btn btn-sec" onClick={e => { e.preventDefault(); scrollTo("contact"); }}>Let's Connect</a>
          </div>
        </div>
        <div className="hero-right">
          <HeroScene />
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────────────────────────────── */}
      <div className="stats-row">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 100}>
            <div className="stat-cell" style={{ "--s-color": s.color }}>
              <span className="stat-icon">{s.icon}</span>
              <div className="stat-val" style={{ color: s.color }}>
                <Counter target={s.val} suffix={s.suffix} />
              </div>
              <div className="stat-lbl">{s.label}</div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* ─── ABOUT ────────────────────────────────────────────────────────── */}
      <section id="about">
        <div className="sec">
          <div className="eyebrow"><span className="eyebrow-num">01</span> — About</div>
          <h2 className="sec-title">Engineered for <em>Impact</em></h2>
          <div className="about-grid">
            <Reveal from="left">
              <TiltCard>
                <div className="avatar-shell">
                  <span className="avatar-init">SB</span>
                </div>
              </TiltCard>
            </Reveal>
            <Reveal from="right" delay={140}>
              <div>
                <p className="about-p">I build systems that handle real traffic — from <strong>50,000+ daily API requests</strong> to <strong>10,000+ concurrent users</strong>. I care obsessively about performance, accessibility, and the developer experience from architecture to deployment.</p>
                <p className="about-p">At <strong>Vividhity Ventures</strong>, I took two platforms from zero to production simultaneously — backend, frontend, AI pipeline, and DevOps. That kind of end-to-end ownership is what I live for.</p>
                <p className="about-p">My technical edge is the <strong>AI × systems intersection</strong>: computer vision pipelines, graph algorithms, multi-tenant architecture, and Claude Vision API integrations that actually ship.</p>

                <div style={{ marginTop: "1.8rem" }}>
                  <div style={{ fontFamily: "var(--fmono)", fontSize: ".62rem", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--purple)", marginBottom: ".9rem" }}>Beyond the Code</div>
                  <div className="interests-row">
                    {INTERESTS.map(item => (
                      <div key={item.label} className="i-pill">
                        <span>{item.emoji}</span><span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="edu-card" style={{ marginTop: "2rem", "--edu-color": "var(--cyan)" }}>
                  <div className="edu-deg">Master of Computer Applications (MCA)</div>
                  <div className="edu-school">Jain University, Bengaluru</div>
                  <div className="edu-period">2025 – 2027 · Distance Learning</div>
                </div>
                <div className="edu-card" style={{ "--edu-color": "var(--purple)" }}>
                  <div className="edu-deg">Bachelor of Computer Applications (BCA)</div>
                  <div className="edu-school">Bharatesh College of Computer Applications, Belagavi</div>
                  <div className="edu-period">2020 – 2023</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── EXPERIENCE ───────────────────────────────────────────────────── */}
      <div className="bg-alt">
        <section id="experience">
          <div className="sec">
            <div className="eyebrow"><span className="eyebrow-num">02</span> — Experience</div>
            <h2 className="sec-title">Where I've <em>Shipped</em></h2>
            <div className="timeline">
              <Reveal>
                <div className="t-item">
                  <div className="t-dot" />
                  <div className="t-role">Software Engineer</div>
                  <div className="t-company">Vividhity Ventures Private Limited</div>
                  <div className="t-meta">July 2025 – Present · Bengaluru, Karnataka</div>
                  <ul className="t-bullets">
                    <li>Architected and deployed <strong>Formalls</strong> — production multi-tenant SaaS managing 100+ stores, 20+ restaurants and 500+ daily bookings; designed normalised MySQL schemas for strict cross-tenant data isolation serving 5+ enterprise clients.</li>
                    <li>Implemented <strong>5-tier JWT-based RBAC</strong> securing data for 10,000+ users; scaled backend to 50,000+ daily requests at 99.9% uptime using Gunicorn and WhiteNoise on Railway.</li>
                    <li>Engineered <strong>MallNav</strong> — Claude Vision API + OpenCV pipeline that auto-classifies POIs at 90% accuracy, cutting setup time from 8 hours to 45 minutes; Dijkstra's on dynamic weighted graphs powers multi-floor pathfinding.</li>
                    <li>Built a <strong>collaborative filtering recommendation engine</strong> on user visit/purchase history, boosting engagement by 30% and average transaction value by 25%.</li>
                    <li>Optimised SQL query bottlenecks and indexing strategies, achieving <strong>60% reduction in average response latency</strong> on high-traffic analytical endpoints.</li>
                    <li>Integrated <strong>WhatsApp Business API</strong> for 24/7 automated support, cutting support ticket volume by 45% while maintaining 95% CSAT score.</li>
                    <li>Maintained <strong>85%+ test coverage</strong> through TDD and peer reviews in an 8-member Agile team; authored comprehensive API documentation.</li>
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </div>

      {/* ─── PROJECTS ─────────────────────────────────────────────────────── */}
      <section id="projects">
        <div className="sec">
          <div className="eyebrow"><span className="eyebrow-num">03</span> — Proof of Work</div>
          <h2 className="sec-title">Systems That <em>Move the Needle</em></h2>
          <div className="proj-grid">
            {PROJECTS.map((p, i) => {
              const isExp = expandedProj === p.title;
              return (
                <Reveal key={p.title} delay={i * 160}>
                  <TiltCard intensity={10}>
                    <div className="proj-card"
                      style={{ "--p-accent": p.accent }}
                      onMouseMove={e => {
                        const r = e.currentTarget.getBoundingClientRect();
                        e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
                        e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
                      }}>
                      <div className="proj-top">
                        <div className="proj-icon">{p.icon}</div>
                        <div>
                          <div className="proj-title">{p.title}</div>
                          <div className="proj-sub">{p.subtitle}</div>
                          <div className="proj-period">{p.period}</div>
                        </div>
                      </div>
                      <div className="psr">
                        <div className="psr-cell"><div className="psr-label">⚠ Problem</div><div className="psr-text">{p.problem}</div></div>
                        <div className="psr-cell"><div className="psr-label">⚙ Solution</div><div className="psr-text">{p.solution}</div></div>
                        <div className="psr-cell"><div className="psr-label">✓ Result</div><div className="psr-text">{p.result}</div></div>
                      </div>
                      {p.showDiagram && (
                        <>
                          <button className="proj-toggle" onClick={() => setExpandedProj(isExp ? null : p.title)}>
                            {isExp ? "▲ Hide" : "▼ Show"} Architecture
                          </button>
                          {isExp && <MallNavDiagram />}
                        </>
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

      {/* ─── SKILLS ───────────────────────────────────────────────────────── */}
      <div className="bg-alt">
        <section id="skills">
          <div className="sec">
            <div className="eyebrow"><span className="eyebrow-num">04</span> — Arsenal</div>
            <h2 className="sec-title">Tools &amp; <em>Technologies</em></h2>
            <div className="skill-grid">
              {SKILLS.map((g, i) => (
                <Reveal key={g.cat} delay={i * 80}>
                  <div className="sg" style={{ "--sg-c": g.color }}>
                    <div className="sg-head" style={{ color: g.color }}>
                      <span>◈</span>{g.cat}
                    </div>
                    <div className="chips">
                      {g.items.map(item => <span key={item} className="chip">{item}</span>)}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ─── NOTES ────────────────────────────────────────────────────────── */}
      <section id="notes">
        <div className="sec">
          <div className="eyebrow"><span className="eyebrow-num">05</span> — Writing</div>
          <h2 className="sec-title">Built, Broken &amp; <em>Learned</em></h2>
          <p style={{ color: "var(--muted)", maxWidth: 520, marginBottom: "3rem", lineHeight: 1.92, fontSize: ".97rem" }}>
            Writing is thinking in public. These are posts I'm working on — complex production problems I had to figure out the hard way, documented for the next engineer who faces them.
          </p>
          <div className="notes-grid">
            {BLOG_POSTS.map((post, i) => (
              <Reveal key={post.title} delay={i * 90}>
                <div className="note-card" style={{ "--nc-c": post.accent }}>
                  <span className="note-emoji">{post.emoji}</span>
                  <span className="note-tag">{post.tag}</span>
                  <div className="note-title">{post.title}</div>
                  <div className="note-desc">{post.desc}</div>
                  <div className="note-footer">
                    <span className="coming-soon">Coming Soon</span>
                    <span>— Draft in progress</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT ──────────────────────────────────────────────────────── */}
      <div className="bg-alt">
        <section id="contact" style={{ textAlign: "center" }}>
          <div className="sec">
            <div className="eyebrow" ><span className="eyebrow-num">06</span> — Connect</div>
            <h2 className="sec-title" style={{ textAlign: "center" }}>Open to Roles &amp; <em>Collaborations</em></h2>
            <p style={{ color: "var(--muted)", maxWidth: 500, margin: "0 auto", lineHeight: 1.94, fontSize: ".97rem" }}>
              Building from scratch, scaling an existing system, or need someone who takes full end-to-end ownership? Let's build something that matters.
            </p>
            <div className="contact-grid">
              {[
                { icon: "✉", label: "bhimannavarsudeep26@gmail.com", href: "mailto:bhimannavarsudeep26@gmail.com" },
                { icon: "◈", label: "linkedin/sudeepbhimannavar-dev26", href: "https://linkedin.com/in/sudeepbhimannavar-dev26" },
                { icon: "⬡", label: "github/Sudeep2642", href: "https://github.com/Sudeep2642" },
                { icon: "↗", label: "sudeep-bhimannavar.vercel.app", href: "https://sudeep-bhimannavar.vercel.app" },
                { icon: "☎", label: "+91-7760531692", href: "tel:+917760531692" },
              ].map((c, i) => (
                <Reveal key={c.label} delay={i * 80}>
                  <a href={c.href} className="clink" target="_blank" rel="noopener noreferrer">
                    <span className="clink-icon">{c.icon}</span>
                    <span>{c.label}</span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </div>

      <footer>
        <div style={{ marginBottom: ".5rem" }}>
          <span className="fn">Sudeep Bhimannavar</span> · Bengaluru, India · Full-Stack Engineer · {new Date().getFullYear()}
        </div>
        <div className="shloka">सत्यमेव जयते — Truth alone triumphs</div>
      </footer>
    </>
  );
}
