import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

/* ─── INLINE ICONS ──────────────────────────────────────────────────────────── */
const FaGithub = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);
const FaLinkedinIn = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const MdArrowOutward = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6v2h8.59L5 17.59 6.41 19 16 9.41V18h2V6z" />
  </svg>
);
const MdCopyright = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-10.5c-.83-1.17-2.12-1.9-3.5-1.9-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5c1.38 0 2.67-.73 3.5-1.9l-1.55-1.03c-.46.67-1.2 1.1-1.95 1.1-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5c.75 0 1.49.43 1.95 1.1L15.5 9.5z" />
  </svg>
);
const TbNotes = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 3m0 2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" />
    <path d="M9 7h6M9 11h6M9 15h4" />
  </svg>
);

/* ─── CSS MARQUEE ─────────────────────────────────────────────────────────── */
function Marquee({ children, speed = 30 }) {
  const duration = (120 / (speed / 30)) + "s";
  return (
    <div style={{ overflow: "hidden", display: "flex", whiteSpace: "nowrap" }}>
      <div style={{ display: "flex", animation: "cssMarquee " + duration + " linear infinite", willChange: "transform" }}>
        <span style={{ display: "flex", alignItems: "center" }}>{children}</span>
        <span style={{ display: "flex", alignItems: "center" }}>{children}</span>
      </div>
    </div>
  );
}

/* ─── DATA ─────────────────────────────────────────────────────────────────── */
const SKILLS_BACKEND = ["Python", "Django", "Django REST", "Node.js", "JWT", "Gunicorn", "WhiteNoise", "TDD", "Docker", "CI/CD"];
const SKILLS_FRONTEND = ["React.js", "Next.js", "JavaScript ES6+", "HTML5", "CSS3", "WCAG 2.1 AA", "ARIA", "Responsive Design"];
const SKILLS_AI = ["Claude Vision API", "OpenCV", "Computer Vision", "Dijkstra's", "Graph Theory", "NetworkX", "NLP", "Generative AI"];
const SKILLS_DB = ["MySQL", "PostgreSQL", "SQLite", "Firebase", "AWS", "Railway", "Docker", "Git", "System Design"];

const PROJECTS = [
  {
    num: "01", title: "MallNav",
    category: "AI Navigation · Python · Django · OpenCV",
    tools: "Claude Vision API · OpenCV · Dijkstra's · NetworkX · Canvas API",
    desc: "AI-powered indoor navigation system. CV pipeline parses floor plans at 90% POI accuracy. Multi-floor pathfinding via Dijkstra's on dynamic weighted graphs. QR-based, app-less entry for 1,000+ concurrent users.",
    metrics: ["90% POI accuracy", "45min setup (was 8hrs)", "95% route accuracy", "80% fewer tickets"],
    period: "Feb 2026 – Present",
    color: "#c2a4ff",
    link: "#",
  },
  {
    num: "02", title: "Formalls",
    category: "SaaS Platform · Django · React.js · MySQL",
    tools: "Django · React.js · MySQL · JWT RBAC · Gunicorn · WhatsApp API",
    desc: "Production multi-tenant SaaS managing 100+ stores, 20+ restaurants and 500+ daily bookings. 5-tier JWT-based RBAC, real-time slot conflict detection, collaborative filtering recommendations, analytics engine.",
    metrics: ["10,000+ DAU", "50,000+ req/day", "99.9% uptime", "60% latency cut"],
    period: "Jul 2025 – Present",
    color: "#fb8dff",
    link: "#",
  },
];

const CAREER = [
  {
    role: "Software Engineer",
    company: "Vividhity Ventures Pvt. Ltd.",
    period: "Jul 2025 - Present",
    desc: "Architected Formalls & MallNav from scratch. 5-tier JWT RBAC securing 10,000+ users, scaled backend to 50,000+ daily requests at 99.9% uptime, cut query latency 60%, integrated WhatsApp Business API — 45% ticket reduction.",
  },
  {
    role: "Internship",
    company: "Palle Technologies, Bengaluru",
    period: "Feb 2025 - Jun 2025",
    desc: "Completed intensive Python Full Stack Development program covering HTML, CSS, JavaScript, React.js, Python, Django, REST APIs, and MySQL.Gained hands-on experience in building end-to-end web applications with modern development practices and industry-standard tools",
  },
];

const STATS = [
  { label: "Daily API Requests", val: 50000, suffix: "+" },
  { label: "Daily Active Users", val: 10000, suffix: "+" },
  { label: "Query Latency Cut", val: 60, suffix: "%" },
  { label: "Platform Uptime", val: 99.9, suffix: "%" },
];

/* ─── USE MOBILE HOOK ─────────────────────────────────────────────────────── */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth <= 768);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

/* ─── CURSOR (desktop only) ─────────────────────────────────────────────── */
function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: -200, y: -200 });
  const ring = useRef({ x: -200, y: -200 });
  const hovering = useRef(false);

  useEffect(() => {
    const onMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    const onEnter = () => { hovering.current = true; };
    const onLeave = () => { hovering.current = false; };
    document.addEventListener("mousemove", onMove);
    document.querySelectorAll("a,button,[data-hover]").forEach(el => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });
    let id;
    const loop = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.1;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.1;
      if (dotRef.current) dotRef.current.style.transform = `translate(${mouse.current.x}px,${mouse.current.y}px)`;
      if (ringRef.current) {
        const s = hovering.current ? 2 : 1;
        ringRef.current.style.transform = `translate(${ring.current.x}px,${ring.current.y}px) scale(${s})`;
        ringRef.current.style.borderColor = hovering.current ? "var(--accent)" : "rgba(255,255,255,0.4)";
      }
      id = requestAnimationFrame(loop);
    };
    loop();
    return () => { document.removeEventListener("mousemove", onMove); cancelAnimationFrame(id); };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{ position: "fixed", top: -5, left: -5, width: 10, height: 10, borderRadius: "50%", background: "#fff", pointerEvents: "none", zIndex: 99999, mixBlendMode: "difference", willChange: "transform" }} />
      <div ref={ringRef} style={{ position: "fixed", top: -20, left: -20, width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.4)", pointerEvents: "none", zIndex: 99998, willChange: "transform", transition: "border-color 0.3s, transform 0.1s" }} />
    </>
  );
}

/* ─── TYPEWRITER ─────────────────────────────────────────────────────────── */
function Typewriter({ strings }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const iv = setInterval(() => setBlink(b => !b), 530);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const cur = strings[idx % strings.length];
    const t = setTimeout(() => {
      if (!del) {
        setText(cur.slice(0, text.length + 1));
        if (text.length + 1 === cur.length) setTimeout(() => setDel(true), 1800);
      } else {
        setText(cur.slice(0, text.length - 1));
        if (text.length - 1 === 0) { setDel(false); setIdx(i => i + 1); }
      }
    }, del ? 38 : 75);
    return () => clearTimeout(t);
  }, [text, del, idx, strings]);

  return (
    <span>
      {text}
      <span style={{ opacity: blink ? 1 : 0, color: "var(--accent2)", transition: "opacity 0.1s" }}>|</span>
    </span>
  );
}

/* ─── THREE.JS GLOBE ─────────────────────────────────────────────────────── */
function GlobeScene({ isMobile }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const W = mount.clientWidth, H = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.z = 3.2;

    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1, 48, 48),
      new THREE.MeshPhongMaterial({ color: 0x100818, emissive: 0x1a0530, specular: 0x9944dd, shininess: 50, transparent: true, opacity: 0.97 })
    );
    scene.add(globe);

    const gridMat = new THREE.LineBasicMaterial({ color: 0xc2a4ff, transparent: true, opacity: 0.1 });
    for (let lat = -80; lat <= 80; lat += 20) {
      const r = Math.cos((lat * Math.PI) / 180), y = Math.sin((lat * Math.PI) / 180);
      const pts = [];
      for (let i = 0; i <= 80; i++) { const a = (i / 80) * Math.PI * 2; pts.push(new THREE.Vector3(r * Math.cos(a), y, r * Math.sin(a))); }
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
    }
    for (let lon = 0; lon < 360; lon += 20) {
      const pts = [], a = (lon * Math.PI) / 180;
      for (let i = 0; i <= 64; i++) { const lat = -90 + (i / 64) * 180, r = Math.cos((lat * Math.PI) / 180), y = Math.sin((lat * Math.PI) / 180); pts.push(new THREE.Vector3(r * Math.cos(a), y, r * Math.sin(a))); }
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
    }

    [{ s: 1.07, c: 0xcc55ff, o: 0.14 }, { s: 1.18, c: 0x9922ee, o: 0.07 }, { s: 1.35, c: 0x660099, o: 0.035 }].forEach(({ s, c, o }) => {
      scene.add(new THREE.Mesh(new THREE.SphereGeometry(s, 32, 32), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, side: THREE.BackSide })));
    });

    const ringDefs = [
      { r: 1.42, c: 0xc481ff, a: 0.38, rx: Math.PI / 2.2, rz: 0.4, spd: 0.007 },
      { r: 1.68, c: 0xaa42ff, a: 0.24, rx: Math.PI / 3, rz: -0.5, spd: -0.004 },
      { r: 1.95, c: 0xfb8dff, a: 0.13, rx: Math.PI / 1.7, rz: 1.1, spd: 0.003 },
    ];
    const rings = ringDefs.map(d => {
      const m = new THREE.Mesh(new THREE.TorusGeometry(d.r, 0.005, 8, 120), new THREE.MeshBasicMaterial({ color: d.c, transparent: true, opacity: d.a }));
      m.rotation.set(d.rx, 0, d.rz);
      m.userData.spd = d.spd;
      scene.add(m);
      return m;
    });

    const starPos = new Float32Array(400 * 3);
    for (let i = 0; i < 400 * 3; i++) starPos[i] = (Math.random() - 0.5) * 35;
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.022, transparent: true, opacity: 0.5 })));

    scene.add(new THREE.AmbientLight(0x100820, 2.5));
    const pl1 = new THREE.PointLight(0xfb8dff, 6, 10); pl1.position.set(2, 2, 2); scene.add(pl1);
    const pl2 = new THREE.PointLight(0x5500ff, 3, 10); pl2.position.set(-3, -1, 1); scene.add(pl2);
    const pl3 = new THREE.PointLight(0xc481ff, 2, 8); pl3.position.set(0, 3, -2); scene.add(pl3);

    let t = 0, targetX = 0, targetY = 0;
    const onMove = (e) => {
      targetX = ((e.clientX / window.innerWidth) - 0.5) * 0.5;
      targetY = ((e.clientY / window.innerHeight) - 0.5) * -0.35;
    };
    // Touch support for globe parallax
    const onTouch = (e) => {
      if (!e.touches[0]) return;
      targetX = ((e.touches[0].clientX / window.innerWidth) - 0.5) * 0.3;
      targetY = ((e.touches[0].clientY / window.innerHeight) - 0.5) * -0.2;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });

    const onResize = () => {
      const nW = mount.clientWidth, nH = mount.clientHeight;
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
      renderer.setSize(nW, nH);
    };
    window.addEventListener("resize", onResize);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.006;
      globe.rotation.y += 0.0018;
      camera.position.x += (targetX * 0.4 - camera.position.x) * 0.04;
      camera.position.y += (targetY * 0.3 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);
      rings.forEach(r => { r.rotation.z += r.userData.spd; });
      pl1.intensity = 6 + Math.sin(t) * 1.8;
      pl2.intensity = 3 + Math.sin(t * 0.7 + 1) * 0.9;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [isMobile]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%", pointerEvents: "none" }} />;
}

/* ─── LOADING SCREEN ─────────────────────────────────────────────────────── */
function LoadingScreen({ onDone }) {
  const [pct, setPct] = useState(0);
  const [ready, setReady] = useState(false);
  const [out, setOut] = useState(false);

  useEffect(() => {
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 3.5 + 0.8;
      if (p >= 100) { p = 100; clearInterval(iv); setTimeout(() => setReady(true), 350); }
      setPct(Math.min(Math.floor(p), 100));
    }, 55);
    return () => clearInterval(iv);
  }, []);

  const handleEnter = () => {
    if (!ready) return;
    setOut(true);
    setTimeout(onDone, 900);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg)", zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: out ? 0 : 1, transition: "opacity 0.9s ease", pointerEvents: out ? "none" : "auto" }}>
      <div style={{ position: "absolute", top: "-10%", left: "-5%", width: 400, height: 400, borderRadius: "50%", background: "#7b22dd", filter: "blur(100px)", opacity: 0.12, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-5%", right: "-5%", width: 350, height: 350, borderRadius: "50%", background: "#fb8dff", filter: "blur(90px)", opacity: 0.10, pointerEvents: "none" }} />

      <div style={{ position: "absolute", top: 0, width: "100%", padding: "18px 0", borderBottom: "1px solid rgba(194,164,255,0.1)", overflow: "hidden" }}>
        <Marquee speed={38}>
          {["FULL-STACK ENGINEER", "AI · SAAS · REACT · DJANGO · OPENCV", "BENGALURU, INDIA", "10K+ DAU · 50K+ req/day · 99.9% UPTIME"].map((t, i) => (
            <span key={i} style={{ fontSize: 11, letterSpacing: "0.28em", color: i % 2 === 0 ? "var(--accent)" : "rgba(255,255,255,0.28)", marginRight: 64, opacity: i % 2 === 0 ? 0.8 : 1 }}>{t}</span>
          ))}
        </Marquee>
      </div>

      <div style={{ position: "absolute", top: 18, left: "3%", fontWeight: 700, fontSize: 15, letterSpacing: "0.5px", color: "#eae5ec" }}>SB_DEV</div>

      <div
        onClick={handleEnter}
        onTouchEnd={handleEnter}
        data-hover
        style={{ width: 160, height: 160, borderRadius: "50%", border: `1px solid rgba(194,164,255,${ready ? 0.65 : 0.18})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: ready ? "pointer" : "default", transition: "all 0.5s", boxShadow: ready ? "0 0 50px rgba(170,66,255,0.3),inset 0 0 40px rgba(170,66,255,0.08)" : "none", position: "relative", overflow: "hidden" }}
      >
        {ready && (
          <>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle,rgba(170,66,255,0.12) 0%,transparent 70%)", animation: "loadPulse 2s ease-in-out infinite" }} />
            <div style={{ position: "absolute", inset: -1, borderRadius: "50%", border: "1px solid rgba(194,164,255,0.3)", animation: "loadRing 2s ease-in-out infinite" }} />
          </>
        )}
        <div style={{ fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: ready ? "#eae5ec" : "rgba(255,255,255,0.3)", transition: "color 0.4s", position: "relative" }}>
          {ready ? "ENTER" : "Loading"}
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "var(--accent)", marginTop: 4, position: "relative" }}>
          {ready ? "↗" : `${pct}%`}
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 60, width: "min(300px,60vw)", height: 1, background: "rgba(255,255,255,0.06)", borderRadius: 1 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,var(--accent3),var(--accent))", transition: "width 0.1s", borderRadius: 1 }} />
      </div>
      <div style={{ position: "absolute", bottom: 30, fontSize: 11, letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", textAlign: "center", padding: "0 20px" }}>
        Sudeep Bhimannavar · Portfolio 2026
      </div>

      <style>{`
        @keyframes loadPulse { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.04)} }
        @keyframes loadRing  { 0%,100%{transform:scale(1);opacity:0.3} 50%{transform:scale(1.12);opacity:0.1} }
      `}</style>
    </div>
  );
}

/* ─── SCROLL REVEAL ─────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, from = "bottom", threshold = 0.06 }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  const tf = vis ? "none"
    : from === "left" ? "translateX(-48px)"
      : from === "right" ? "translateX(48px)"
        : from === "scale" ? "scale(0.94)"
          : "translateY(42px)";
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: tf, transition: `opacity 0.9s ease ${delay}ms,transform 0.9s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─── ANIMATED COUNTER ─────────────────────────────────────────────────── */
function Counter({ to, suffix = "" }) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        let n = 0;
        const step = to / 75;
        const iv = setInterval(() => {
          n += step;
          if (n >= to) { setV(to); clearInterval(iv); }
          else setV(parseFloat(n.toFixed(1)));
        }, 14);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{typeof to === "number" && to % 1 !== 0 ? v.toFixed(1) : Math.floor(v).toLocaleString()}{suffix}</span>;
}

/* ─── MAGNETIC BUTTON (touch-safe) ─────────────────────────────────────── */
function MagneticBtn({ children, href, onClick, style = {}, isMobile }) {
  const ref = useRef(null);
  const onMove = (e) => {
    if (isMobile) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.35;
    const y = (e.clientY - r.top - r.height / 2) * 0.35;
    ref.current.style.transform = `translate(${x}px,${y}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = "translate(0,0)"; };
  const Tag = href ? "a" : "button";
  return (
    <Tag ref={ref} href={href} onClick={onClick} data-hover
      onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ display: "inline-flex", alignItems: "center", transition: "transform 0.3s cubic-bezier(0.23,1,0.32,1)", ...style }}>
      {children}
    </Tag>
  );
}

/* ─── 3D TILT CARD (touch-safe) ─────────────────────────────────────────── */
function TiltCard({ children, style = {}, strength = 10, isMobile }) {
  const ref = useRef(null);
  const onMove = (e) => {
    if (isMobile) return;
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * strength;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -strength;
    ref.current.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) scale3d(1.02,1.02,1.02)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)"; };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ transition: "transform 0.18s ease", transformStyle: "preserve-3d", willChange: "transform", ...style }}>
      {children}
    </div>
  );
}

/* ─── SKILL PANEL ─────────────────────────────────────────────────────── */
function SkillPanel({ title, tags, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div onClick={() => setOpen(o => !o)} data-hover
      style={{ position: "relative", padding: "22px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)", cursor: "pointer", transition: "background 0.3s", background: open ? "rgba(194,164,255,0.03)" : "transparent" }}
    >
      {[
        { pos: { top: 0, left: 0 }, bl: { borderTop: "2px solid rgba(255,255,255,0.5)", borderLeft: "2px solid rgba(255,255,255,0.5)" } },
        { pos: { top: 0, right: 0 }, bl: { borderTop: "2px solid rgba(255,255,255,0.5)", borderRight: "2px solid rgba(255,255,255,0.5)" } },
        { pos: { bottom: 0, left: 0 }, bl: { borderBottom: "2px solid rgba(255,255,255,0.5)", borderLeft: "2px solid rgba(255,255,255,0.5)" } },
        { pos: { bottom: 0, right: 0 }, bl: { borderBottom: "2px solid rgba(255,255,255,0.5)", borderRight: "2px solid rgba(255,255,255,0.5)" } },
      ].map((c, i) => (
        <div key={i} style={{ position: "absolute", width: 10, height: 10, ...c.pos, ...c.bl, opacity: 0.3 }} />
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: "clamp(18px,2.2vw,28px)", letterSpacing: 1, margin: 0, fontWeight: 600 }}>{title}</h3>
        <div style={{ width: 28, height: 28, border: "1px solid rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff", transform: open ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.4s", flexShrink: 0 }}>+</div>
      </div>
      <div style={{ maxHeight: open ? "600px" : 0, overflow: "hidden", transition: "max-height 0.5s cubic-bezier(0.4,0,0.2,1)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18, paddingTop: 4 }}>
          {tags.map(t => (
            <span key={t} style={{ fontSize: 13, padding: "4px 12px", background: "rgba(194,164,255,0.1)", border: "1px solid rgba(194,164,255,0.25)", borderRadius: 30, color: "#ddc8ff", letterSpacing: "0.3px" }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── PROJECT CARD ───────────────────────────────────────────────────────── */
function ProjectCard({ p, isMobile }) {
  const [hovered, setHovered] = useState(false);

  return (
    <TiltCard strength={5} isMobile={isMobile} style={{ height: "100%" }}>
      <div
        onMouseEnter={() => !isMobile && setHovered(true)}
        onMouseLeave={() => !isMobile && setHovered(false)}
        style={{ height: "100%", boxSizing: "border-box", padding: isMobile ? "32px 24px" : "48px 44px", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, background: hovered ? "rgba(194,164,255,0.04)" : "rgba(255,255,255,0.015)", transition: "background 0.35s, border-color 0.35s", borderColor: hovered ? `${p.color}44` : "rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", gap: 24, position: "relative", overflow: "hidden" }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${p.color}, transparent 70%)`, opacity: hovered ? 1 : 0.5, transition: "opacity 0.35s" }} />
        <div style={{ position: "absolute", top: -60, left: -40, width: 240, height: 240, borderRadius: "50%", background: p.color, filter: "blur(80px)", opacity: hovered ? 0.08 : 0.04, transition: "opacity 0.5s", pointerEvents: "none" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: p.color, opacity: 0.8, display: "block", marginBottom: 8 }}>{p.period}</span>
            <h3 style={{ fontSize: "clamp(24px,3vw,40px)", fontWeight: 700, lineHeight: 1, margin: 0, color: "#fff", letterSpacing: "-0.01em" }}>{p.title}</h3>
            <p style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", margin: "8px 0 0", lineHeight: 1.5 }}>{p.category}</p>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: "50%", border: `1px solid ${p.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: p.color, flexShrink: 0, background: `${p.color}11`, marginLeft: 12 }}>↗</div>
        </div>

        <p style={{ fontSize: "clamp(13px,1.1vw,15px)", lineHeight: 1.85, color: "rgba(234,229,236,0.65)", fontWeight: 300, margin: 0 }}>{p.desc}</p>

        <div>
          <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 10, marginTop: 0 }}>Stack</p>
          <p style={{ fontSize: 13, color: "rgba(200,190,210,0.55)", margin: 0, lineHeight: 1.7 }}>{p.tools}</p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: "auto" }}>
          {p.metrics.map(m => (
            <span key={m} style={{ fontSize: 11, padding: "5px 14px", background: `${p.color}18`, border: `1px solid ${p.color}44`, borderRadius: 30, color: p.color, letterSpacing: "0.1em", fontWeight: 500 }}>{m}</span>
          ))}
        </div>

        <div style={{ position: "absolute", bottom: 20, right: 24, fontSize: "clamp(48px,7vw,80px)", fontWeight: 800, color: "rgba(255,255,255,0.03)", lineHeight: 1, letterSpacing: "-0.04em", userSelect: "none", pointerEvents: "none" }}>{p.num}</div>
      </div>
    </TiltCard>
  );
}

/* ─── MOBILE NAV MENU ─────────────────────────────────────────────────────── */
function MobileMenu({ open, onClose, scrollTo }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9000,
      background: "rgba(8,5,16,0.97)",
      backdropFilter: "blur(20px)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 40,
      transform: open ? "translateX(0)" : "translateX(100%)",
      transition: "transform 0.4s cubic-bezier(0.23,1,0.32,1)",
    }}>
      <button onClick={onClose} style={{ position: "absolute", top: 24, right: 24, background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", width: 44, height: 44, borderRadius: "50%", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>✕</button>
      {[["About", "about"], ["Skills", "skills"], ["Work", "projects"], ["Contact", "contact"]].map(([label, id]) => (
        <button key={id} onClick={() => { scrollTo(id); onClose(); }}
          style={{ background: "none", border: "none", color: "#eae5ec", fontSize: 32, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", transition: "color 0.3s" }}
          onTouchStart={e => e.currentTarget.style.color = "var(--accent)"}
          onTouchEnd={e => e.currentTarget.style.color = "#eae5ec"}>
          {label}
        </button>
      ))}
      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        {[
          { href: "https://github.com/Sudeep2642", Icon: FaGithub },
          { href: "https://linkedin.com/in/sudeepbhimannavar-dev26", Icon: FaLinkedinIn },
        ].map(({ href, Icon }) => (
          <a key={href} href={href} target="_blank" rel="noopener noreferrer"
            style={{ width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#fff", background: "rgba(194,164,255,0.1)", border: "1px solid rgba(194,164,255,0.25)", textDecoration: "none" }}>
            <Icon />
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─── MAIN APP ─────────────────────────────────────────────────────────────── */
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActive] = useState("landing");
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!loaded) return;
    const sections = ["landing", "about", "skills", "career", "projects", "contact"];
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.25 }
    );
    sections.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [loaded]);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const css = `
    :root {
      --bg: #080510;
      --accent: #c2a4ff;
      --accent2: #fb8dff;
      --accent3: #aa42ff;
      --cMaxWidth: 1400px;
      --cWidth: 88%;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
    body { background: var(--bg); color: #eae5ec; font-family: 'Inter', -apple-system, sans-serif; overflow-x: hidden; }
    body.desktop-cursor { cursor: none; }
    body.desktop-cursor a, body.desktop-cursor button { cursor: none; }

    /* Prevent 300ms tap delay */
    a, button { touch-action: manipulation; }

    @keyframes floatY   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
    @keyframes spinSlow { from{transform:rotate(0)} to{transform:rotate(360deg)} }
    @keyframes glowDot  { 0%,30%,100%,64%,80%{ box-shadow:0 0 5px 2px #d29bff,0 0 15px 5px #d097ff,0 0 110px 20px #f2c0ff }
                          10%,20%,50%,70%,90%{ box-shadow:0 0 5px 2px #d29bff } }
    @keyframes growLine { from{max-height:0} to{max-height:100%} }
    @keyframes shimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
    @keyframes cssMarquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
    @keyframes blobFloat1 { 0%,100%{transform:translate(0,0) scale(1)}   50%{transform:translate(40px,-30px) scale(1.05)} }
    @keyframes blobFloat2 { 0%,100%{transform:translate(0,0) scale(1)}   50%{transform:translate(-30px,40px) scale(0.97)} }

    .nav-hl { position:relative; overflow:hidden; display:flex; }
    .hl-inner { transition:transform 0.32s cubic-bezier(0.23,1,0.32,1); display:flex; flex-direction:column; position:relative; }
    .hl-dup { position:absolute; top:100%; left:0; color:var(--accent); white-space:nowrap; }
    .nav-hl:hover .hl-inner { transform:translateY(-100%); }

    .shimmer-text {
      background: linear-gradient(90deg, #eae5ec 0%, var(--accent) 35%, #fb8dff 50%, var(--accent) 65%, #eae5ec 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 4s linear infinite;
    }

    .sep { width:100%; height:1px; background:rgba(255,255,255,0.06); }

    /* Social rail — hidden on mobile, shown desktop */
    .social-rail {
      position: fixed;
      bottom: 24px;
      left: 3%;
      z-index: 600;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 18px;
    }
    .social-rail a {
      width: 36px; height: 36px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; color: rgba(255,255,255,0.45);
      background: rgba(10,6,20,0.75);
      border: 1px solid rgba(194,164,255,0.15);
      backdrop-filter: blur(8px);
      transition: color 0.3s, border-color 0.3s, transform 0.3s, background 0.3s;
      text-decoration: none;
    }
    .social-rail a:hover { color: var(--accent); border-color: rgba(194,164,255,0.45); background: rgba(194,164,255,0.1); transform: translateY(-3px); }
    .social-line { width: 1px; height: 50px; background: linear-gradient(to bottom, rgba(194,164,255,0.3), transparent); }

    a.cs {
      font-size: clamp(15px,1.4vw,20px);
      border-bottom: 1px solid rgba(255,255,255,0.25);
      padding-bottom: 5px; display: flex; align-items: center; gap: 6px;
      transition: all 0.3s; color: inherit; text-decoration: none;
    }
    a.cs:hover { color: var(--accent); border-color: var(--accent); gap: 14px; }

    .stat-card { transition: all 0.3s; }
    .stat-card:hover { background: rgba(194,164,255,0.06) !important; border-color: rgba(194,164,255,0.3) !important; }

    /* ── Hamburger ── */
    .hamburger {
      display: none;
      flex-direction: column; justify-content: center; align-items: center; gap: 5px;
      width: 44px; height: 44px;
      background: rgba(194,164,255,0.08);
      border: 1px solid rgba(194,164,255,0.2);
      border-radius: 8px;
      cursor: pointer;
      padding: 0;
    }
    .hamburger span {
      display: block; width: 22px; height: 2px;
      background: rgba(234,229,236,0.8); border-radius: 2px;
      transition: transform 0.3s, opacity 0.3s;
    }

    /* ── Proj grid ── */
    .proj-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      width: var(--cWidth);
      max-width: var(--cMaxWidth);
      margin: 0 auto;
      padding-bottom: 100px;
    }

    /* ────── TABLET (≤ 1000px) ────── */
    @media(max-width:1000px){
      .proj-grid { grid-template-columns: 1fr; }
      .hero-side-left, .hero-side-right { display: none !important; }
      .globe-wrapper { height: 340px !important; width: 100% !important; left: 0 !important; transform: none !important; }
      .about-grid { flex-direction: column !important; }
      .about-grid > * { width: 100% !important; padding-right: 0 !important; }
      .career-row { flex-direction: column !important; gap: 12px !important; }
      .career-row > div { width: 100% !important; }
      .career-line { display: none !important; }
      .skills-row { flex-direction: column !important; }
      .skills-row > * { width: 100% !important; padding-right: 0 !important; }
      .contact-row { flex-direction: column !important; }
      .social-rail { display: none; }
      .resume-fixed { display: none !important; }
      .hamburger { display: flex; }
      .desktop-nav-links { display: none !important; }
    }

    /* ────── MOBILE (≤ 768px) ────── */
    @media(max-width:768px){
      :root { --cWidth: 92%; }

      /* Hero: stacked layout */
      .hero-mobile-content {
        display: flex !important;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 12px;
        padding-top: 100px;
        z-index: 10;
        position: relative;
      }
      .globe-wrapper {
        height: 280px !important;
        position: relative !important;
        bottom: auto !important;
        left: auto !important;
        transform: none !important;
        width: 100% !important;
        margin-top: -20px;
      }

      /* About stats 2-col */
      .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }

      /* Career */
      .career-section { padding-top: 60px !important; padding-bottom: 60px !important; }
      .career-heading { font-size: clamp(30px,8vw,48px) !important; margin-bottom: 48px !important; }
      .career-row { margin-bottom: 40px !important; }

      /* Contact email */
      .contact-email { font-size: 13px !important; word-break: break-all; }

      /* Skill panels */
      .skill-panel-title { font-size: 18px !important; }

      /* Section paddings */
      .section-pad { padding-top: 60px !important; padding-bottom: 60px !important; }
    }

    /* ────── SMALL MOBILE (≤ 400px) ────── */
    @media(max-width:400px){
      :root { --cWidth: 94%; }
      .stats-grid { grid-template-columns: 1fr !important; }
    }

    /* iOS safe area */
    @supports(padding: max(0px)){
      nav { padding-left: max(0px, env(safe-area-inset-left)) !important; padding-right: max(0px, env(safe-area-inset-right)) !important; }
    }
  `;

  useEffect(() => {
    if (!isMobile) {
      document.body.classList.add("desktop-cursor");
    } else {
      document.body.classList.remove("desktop-cursor");
    }
  }, [isMobile]);

  if (!loaded) return (
    <>
      <style>{css}</style>
      <LoadingScreen onDone={() => setLoaded(true)} />
    </>
  );

  return (
    <>
      <style>{css}</style>
      {!isMobile && <Cursor />}

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} scrollTo={scrollTo} />

      {/* Ambient blobs */}
      <div style={{ position: "fixed", top: "-5%", left: "-8%", width: 500, height: 500, borderRadius: "50%", background: "#7b22dd", filter: "blur(110px)", opacity: 0.13, pointerEvents: "none", zIndex: 0, animation: "blobFloat1 12s ease-in-out infinite" }} />
      <div style={{ position: "fixed", top: "45%", right: "-8%", width: 420, height: 420, borderRadius: "50%", background: "#fb8dff", filter: "blur(100px)", opacity: 0.09, pointerEvents: "none", zIndex: 0, animation: "blobFloat2 16s ease-in-out infinite" }} />

      <div style={{ position: "fixed", top: 0, width: "100%", height: 120, background: "linear-gradient(to bottom,var(--bg) 0%,transparent 100%)", pointerEvents: "none", zIndex: 12 }} />

      {/* ── NAV ── */}
      <nav style={{ display: "flex", maxWidth: "var(--cMaxWidth)", width: "var(--cWidth)", justifyContent: "space-between", alignItems: "center", padding: "20px 0", position: "fixed", left: "50%", transform: "translateX(-50%)", top: 0, zIndex: 500, boxSizing: "border-box" }}>
        <a href="#landing" onClick={e => { e.preventDefault(); scrollTo("landing"); }}
          style={{ fontWeight: 700, fontSize: 15, letterSpacing: "0.5px", color: "#eae5ec", display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 10px var(--accent3)", display: "inline-block", animation: "glowDot 2s linear infinite" }} />
          SB_DEV
        </a>

        {/* Desktop links */}
        <ul className="desktop-nav-links" style={{ display: "flex", gap: 44, listStyle: "none", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {[["About", "about"], ["Work", "projects"], ["Contact", "contact"]].map(([label, id]) => (
            <li key={id}>
              <a href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id); }}
                className="nav-hl"
                style={{ color: activeSection === id ? "var(--accent)" : "rgba(255,255,255,0.55)", transition: "color 0.3s", textDecoration: "none" }}>
                <span className="hl-inner">{label}<span className="hl-dup">{label}</span></span>
              </a>
            </li>
          ))}
          <li>
            <MagneticBtn href="/Sudeep_Bhimannavar_SoftwareEngineer.pdf" download isMobile={isMobile}
              style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", padding: "8px 20px", border: "1px solid rgba(194,164,255,0.4)", borderRadius: 3, color: "var(--accent)", textDecoration: "none", background: "transparent" }}>
              Resume ↓
            </MagneticBtn>
          </li>
        </ul>

        {/* Hamburger (mobile) */}
        <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* Social rail (desktop) */}
      <div className="social-rail">
        {[{ href: "https://github.com/Sudeep2642", Icon: FaGithub, label: "GitHub" }, { href: "https://linkedin.com/in/sudeepbhimannavar-dev26", Icon: FaLinkedinIn, label: "LinkedIn" }].map(({ href, Icon, label }) => (
          <a key={href} href={href} target="_blank" rel="noopener noreferrer" data-hover aria-label={label}><Icon /></a>
        ))}
        <div className="social-line" />
      </div>

      {/* Resume fixed right (desktop) */}
      <a href="/Sudeep_Bhimannavar_Software_Engineer.pdf" download data-hover className="resume-fixed"
        style={{ position: "fixed", bottom: 40, right: 0, zIndex: 600, fontWeight: 600, fontSize: 12, letterSpacing: "0.35em", color: "rgba(255,255,255,0.3)", textDecoration: "none", transition: "color 0.3s", transform: "translateX(100%) rotate(-90deg)", transformOrigin: "left bottom", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}
        onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
        onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>
        RESUME <TbNotes style={{ fontSize: 16 }} />
      </a>

      {/* ── HERO ── */}
      <section id="landing" style={{ width: "100%", maxWidth: "var(--cMaxWidth)", margin: "auto", minHeight: "100svh", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ width: "var(--cWidth)", margin: "auto", flex: 1, position: "relative", maxWidth: "var(--cMaxWidth)", display: "flex", flexDirection: "column" }}>

          {/* Desktop: side panels */}
          <div className="hero-side-left" style={{ position: "absolute", zIndex: 9, top: "50%", right: "66%", transform: "translateY(-50%)" }}>
            <Reveal from="left">
              <p style={{ margin: 0, color: "var(--accent)", fontSize: 20, fontWeight: 300, letterSpacing: "0.14em", marginBottom: 6 }}>Hello! I'm</p>
              <h1 style={{ margin: 0, letterSpacing: "0.05em", fontSize: "clamp(26px,2.8vw,50px)", lineHeight: 1.05, fontWeight: 700, marginTop: 4 }}>
                SUDEEP<br /><span style={{ fontWeight: 300, color: "rgba(234,229,236,0.7)" }}>BHIMANNAVAR</span>
              </h1>
              <p style={{ marginTop: 14, fontSize: 13, letterSpacing: "0.14em", color: "rgba(255,255,255,0.35)", fontWeight: 400, maxWidth: 200, lineHeight: 1.65 }}>
                Full-Stack Engineer<br />Bengaluru, India
              </p>
            </Reveal>
          </div>

          {/* Mobile: stacked hero content above globe */}
          <div className="hero-mobile-content" style={{ display: "none" }}>
            <Reveal>
              <p style={{ color: "var(--accent)", fontSize: 14, fontWeight: 300, letterSpacing: "0.14em", marginBottom: 4 }}>Hello! I'm</p>
              <h1 style={{ letterSpacing: "0.03em", fontSize: "clamp(30px,9vw,52px)", lineHeight: 1.05, fontWeight: 700 }}>
                SUDEEP <span style={{ fontWeight: 300, color: "rgba(234,229,236,0.7)" }}>BHIMANNAVAR</span>
              </h1>
              <h2 style={{ fontWeight: 700, fontSize: "clamp(22px,6vw,34px)", lineHeight: 1, letterSpacing: "0.03em", color: "var(--accent2)", marginTop: 8 }}>
                <Typewriter strings={["ENGINEER", "AI BUILDER", "ARCHITECT", "PROBLEM SOLVER"]} />
              </h2>
              <p style={{ fontSize: 13, letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", fontWeight: 400, marginTop: 6 }}>
                Full-Stack Engineer · Bengaluru, India
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 14 }}>
                {["Django", "React", "AI", "SaaS"].map(tag => (
                  <span key={tag} style={{ fontSize: 11, letterSpacing: "0.18em", padding: "4px 12px", border: "1px solid rgba(194,164,255,0.25)", borderRadius: 3, color: "rgba(194,164,255,0.7)" }}>{tag}</span>
                ))}
              </div>
              {/* Mobile social links */}
              <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
                {[{ href: "https://github.com/Sudeep2642", Icon: FaGithub }, { href: "https://linkedin.com/in/sudeepbhimannavar-dev26", Icon: FaLinkedinIn }].map(({ href, Icon }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                    style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff", background: "rgba(194,164,255,0.1)", border: "1px solid rgba(194,164,255,0.25)", textDecoration: "none" }}>
                    <Icon />
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Globe */}
          <div className="globe-wrapper" style={{ position: "absolute", bottom: 0, height: "92%", left: "50%", transform: "translateX(-50%)", width: "clamp(280px,48vw,680px)", zIndex: 0 }}>
            <div style={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", background: "#ee88ff", filter: "blur(60px)", opacity: 0.14, bottom: "-8%", left: "50%", transform: "translateX(-50%) scale(1.3)", zIndex: 1 }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 220, background: "linear-gradient(to top,var(--bg) 40%,transparent)", zIndex: 2 }} />
            <GlobeScene isMobile={isMobile} />
          </div>

          {/* Desktop right panel */}
          <div className="hero-side-right" style={{ position: "absolute", zIndex: 9, top: "50%", left: "66%", transform: "translateY(-50%)" }}>
            <Reveal from="right" delay={100}>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 300, letterSpacing: "0.12em", color: "var(--accent)", marginBottom: 4 }}>A Creative</p>
              <h2 style={{ margin: 0, fontWeight: 700, fontSize: "clamp(26px,3.2vw,52px)", lineHeight: 1, letterSpacing: "0.05em", color: "var(--accent2)" }}>
                <Typewriter strings={["ENGINEER", "AI BUILDER", "ARCHITECT", "PROBLEM SOLVER"]} />
              </h2>
              <h2 style={{ margin: 0, marginTop: -12, fontWeight: 400, fontSize: "clamp(20px,2.4vw,38px)", lineHeight: 1.1, letterSpacing: "0.05em" }}>Developer</h2>
              <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
                {["Django", "React", "AI", "SaaS"].map(tag => (
                  <span key={tag} style={{ fontSize: 11, letterSpacing: "0.18em", padding: "4px 12px", border: "1px solid rgba(194,164,255,0.25)", borderRadius: 3, color: "rgba(194,164,255,0.7)" }}>{tag}</span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Scroll indicator */}
          <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.35, zIndex: 5 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.25em", color: "rgba(255,255,255,0.5)" }}>SCROLL</div>
            <div style={{ width: 1, height: 44, background: "linear-gradient(to bottom,var(--accent),transparent)" }} />
          </div>
        </div>
      </section>

      <div className="sep" />

      {/* ── TECH MARQUEE ── */}
      <div style={{ padding: "24px 0", background: "rgba(0,0,0,0.25)", overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <Marquee speed={30}>
          {[...SKILLS_BACKEND, ...SKILLS_FRONTEND, ...SKILLS_AI, ...SKILLS_DB].map((s, i) => (
            <span key={i} style={{ fontSize: 11, letterSpacing: "0.3em", color: i % 3 === 0 ? "var(--accent)" : "rgba(255,255,255,0.22)", marginRight: 48, textTransform: "uppercase" }}>{s}</span>
          ))}
        </Marquee>
      </div>

      {/* ── ABOUT ── */}
      <section id="about" style={{ width: "var(--cWidth)", maxWidth: "var(--cMaxWidth)", margin: "auto", minHeight: "100vh", padding: "80px 0" }} className="section-pad">
        <div className="about-grid" style={{ display: "flex", gap: "8%", width: "100%" }}>

          <div style={{ width: "45%", flexShrink: 0 }}>
            <Reveal from="left">
              <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.35em", color: "var(--accent)", margin: 0, marginBottom: 12 }}>About Me</p>
              <h2 style={{ fontSize: "clamp(24px,3.5vw,52px)", fontWeight: 600, lineHeight: 1.12, letterSpacing: "0.02em", margin: 0, marginBottom: 24 }}>
                Full-stack engineer who ships systems that handle{" "}
                <span className="shimmer-text">real traffic.</span>
              </h2>
              <p style={{ fontSize: "clamp(13px,1.15vw,17px)", fontWeight: 300, lineHeight: 1.85, color: "rgba(234,229,236,0.65)", marginBottom: 20 }}>
                At Vividhity Ventures I built two production platforms simultaneously — <strong style={{ color: "var(--accent2)", fontWeight: 500 }}>Formalls</strong> (multi-tenant SaaS for 10,000+ DAU) and <strong style={{ color: "var(--accent2)", fontWeight: 500 }}>MallNav</strong> (AI indoor navigation using Claude Vision API). I own the full stack: backend, frontend, AI pipelines, DevOps.
              </p>
              <p style={{ fontSize: "clamp(13px,1.15vw,17px)", fontWeight: 300, lineHeight: 1.85, color: "rgba(234,229,236,0.55)", marginBottom: 32 }}>
                My edge sits at the intersection of computer vision, graph algorithms, and modern web architecture — all shipped with 85%+ TDD coverage and WCAG 2.1 AA compliance.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[["🏎", "Formula 1"], ["🎌", "Anime"], ["📚", "Crime & Mystery"], ["🔍", "Robert Langdon"], ["🌿", "Nature Walks"]].map(([e, l]) => (
                  <span key={l} style={{ fontSize: 12, padding: "5px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 40, color: "rgba(234,229,236,0.6)" }}>{e} {l}</span>
                ))}
              </div>
            </Reveal>
          </div>

          <div style={{ flex: 1 }}>
            <Reveal delay={120}>
              <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
                {STATS.map((s) => (
                  <TiltCard key={s.label} strength={6} isMobile={isMobile}>
                    <div className="stat-card" style={{ padding: "20px 18px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8 }}>
                      <div style={{ fontSize: "clamp(22px,3vw,40px)", fontWeight: 700, lineHeight: 1, marginBottom: 6, background: "linear-gradient(135deg,var(--accent2),var(--accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                        <Counter to={s.val} suffix={s.suffix} />
                      </div>
                      <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>{s.label}</div>
                    </div>
                  </TiltCard>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { deg: "MCA — Master of Computer Applications", school: "Jain University, Bengaluru", yr: "2025 – 2027 · Distance Learning" },
                  { deg: "BCA — Bachelor of Computer Applications", school: "Bharatesh College of Computer Applications", yr: "2020 – 2023 · Belagavi" },
                ].map(e => (
                  <div key={e.deg} style={{ padding: "14px 18px", borderLeft: "2px solid var(--accent3)", background: "rgba(194,164,255,0.04)", borderRadius: "0 8px 8px 0" }}>
                    <div style={{ fontWeight: 600, fontSize: "clamp(12px,1.1vw,14px)", marginBottom: 3 }}>{e.deg}</div>
                    <div style={{ fontSize: 13, color: "var(--accent)", marginBottom: 2 }}>{e.school}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}>{e.yr}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="sep" />

      {/* ── SKILLS ── */}
      <section id="skills" style={{ width: "var(--cWidth)", maxWidth: "var(--cMaxWidth)", margin: "auto", minHeight: "100vh", padding: "80px 0" }} className="section-pad">
        <div className="skills-row" style={{ display: "flex", width: "100%", gap: "8%" }}>

          <div style={{ width: "42%", flexShrink: 0 }}>
            <Reveal from="left">
              <h2 style={{ fontSize: "clamp(44px,6.5vw,95px)", lineHeight: 0.92, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
                W<em style={{ fontStyle: "italic", fontWeight: 300 }}>HAT</em>
                <div>I<span style={{ color: "var(--accent)" }}> DO</span></div>
              </h2>
              <p style={{ marginTop: 28, fontSize: "clamp(13px,1.1vw,15px)", lineHeight: 1.85, color: "rgba(234,229,236,0.5)", fontWeight: 300, maxWidth: 360 }}>
                I engineer end-to-end systems — React UIs to Django APIs, computer vision pipelines to graph-based navigation. Everything ships to production.
              </p>
              <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
                {[{ n: "10+", label: "months production exp." }, { n: "2", label: "platforms shipped" }, { n: "85%+", label: "test coverage enforced" }].map(s => (
                  <div key={s.label} style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span style={{ fontSize: "clamp(20px,2.5vw,32px)", fontWeight: 700, color: "var(--accent2)" }}>{s.n}</span>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div style={{ flex: 1, position: "relative", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {[
              { title: "DEVELOP", tags: [...SKILLS_BACKEND, ...SKILLS_FRONTEND], defaultOpen: true },
              { title: "AI & VISION", tags: SKILLS_AI, defaultOpen: false },
              { title: "DATA & CLOUD", tags: SKILLS_DB, defaultOpen: false },
            ].map((panel, i) => (
              <Reveal key={panel.title} delay={i * 80}>
                <SkillPanel {...panel} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="sep" />

      {/* ── CAREER ── */}
      <section id="career" className="career-section" style={{ width: "var(--cWidth)", maxWidth: "var(--cMaxWidth)", margin: "auto", minHeight: "100vh", paddingTop: 80, paddingBottom: 80 }}>
        <Reveal>
          <h2 className="career-heading" style={{ fontSize: "clamp(28px,5vw,68px)", lineHeight: 1, fontWeight: 400, textAlign: "center", marginBottom: 72, background: "linear-gradient(180deg,#ffffff 0%,#7f40ff 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>
            My career <span style={{ fontWeight: 300 }}>&</span><br />experience
          </h2>
        </Reveal>

        <div style={{ position: "relative", maxWidth: 980, margin: "0 auto" }}>
          {/* Timeline line (desktop only) */}
          <div className="career-line" style={{ position: "absolute", top: -50, left: "50%", transform: "translateX(-50%)", width: 2, height: "calc(100% + 50px)", backgroundImage: "linear-gradient(to top,#aa42ff 15%,var(--accent) 50%,transparent 95%)", animation: "growLine 2s ease forwards" }}>
            <div style={{ position: "absolute", bottom: -4, left: "50%", transform: "translate(-50%,50%)", width: 12, height: 12, borderRadius: "50%", background: "#aa42ff", boxShadow: "0 0 6px 3px #d29bff,0 0 20px 8px #d097ff,0 0 60px 20px #f2c0ff", animation: "glowDot 1s linear infinite" }} />
          </div>

          {/* Mobile: left border timeline */}
          <div style={{ display: "none" }} className="mobile-timeline-line" />

          {CAREER.map((c, i) => (
            <Reveal key={c.period} delay={i * 110}>
              <div className="career-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: 56 }}>
                <div style={{ width: "42%", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                  <div>
                    <h4 style={{ fontSize: "clamp(16px,1.8vw,24px)", fontWeight: 600, margin: 0, lineHeight: 1.2, letterSpacing: "0.02em" }}>{c.role}</h4>
                    <h5 style={{ fontWeight: 400, fontSize: "clamp(12px,1.1vw,15px)", margin: "8px 0 0", color: "var(--accent)", letterSpacing: "0.04em" }}>{c.company}</h5>
                  </div>
                  <h3 style={{ fontSize: "clamp(22px,3vw,40px)", margin: 0, fontWeight: 600, lineHeight: 1, flexShrink: 0, color: "rgba(255,255,255,0.15)" }}>{c.period}</h3>
                </div>
                <p style={{ width: "42%", fontSize: "clamp(12px,1.05vw,15px)", fontWeight: 300, margin: 0, color: "rgba(234,229,236,0.65)", lineHeight: 1.78 }}>{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="sep" />

      {/* ── PROJECTS ── */}
      <section id="projects" style={{ paddingTop: 60 }}>
        <div style={{ width: "var(--cWidth)", maxWidth: "var(--cMaxWidth)", margin: "auto", paddingBottom: 48 }}>
          <Reveal>
            <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.35em", color: "var(--accent)", marginBottom: 10 }}>Selected Work</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
              <h2 style={{ fontSize: "clamp(30px,5vw,68px)", fontWeight: 600, margin: 0 }}>
                My <span style={{ color: "var(--accent)" }}>Work</span>
              </h2>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", margin: 0, textTransform: "uppercase" }}>
                {PROJECTS.length} projects in production
              </p>
            </div>
          </Reveal>
        </div>

        <div className="proj-grid">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.num} delay={i * 100} from="bottom">
              <ProjectCard p={p} isMobile={isMobile} />
            </Reveal>
          ))}
        </div>
      </section>

      <div className="sep" />

      {/* ── CONTACT ── */}
      <section id="contact" style={{ width: "var(--cWidth)", maxWidth: "var(--cMaxWidth)", margin: "auto", paddingTop: 80, paddingBottom: 80 }} className="section-pad">
        <Reveal>
          <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.35em", color: "var(--accent)", marginBottom: 12 }}>Get in Touch</p>
          <h2 style={{ fontSize: "clamp(28px,5vw,68px)", fontWeight: 400, textTransform: "uppercase", margin: 0, marginBottom: 16, letterSpacing: "0.04em" }}>
            Let's <span style={{ color: "var(--accent2)" }}>Connect</span>
          </h2>
          <p style={{ fontSize: "clamp(13px,1.1vw,16px)", fontWeight: 300, color: "rgba(234,229,236,0.5)", marginBottom: 48, maxWidth: 440, lineHeight: 1.75 }}>
            Open to senior full-stack roles, collaborations, or just a good conversation about systems and scale.
          </p>
        </Reveal>

        <div className="contact-row" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 40 }}>
          <Reveal delay={80} from="left">
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <p style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>Email</p>
                <a href="mailto:bhimannavarsudeep26@gmail.com" className="contact-email"
                  style={{ fontSize: "clamp(13px,1.3vw,17px)", color: "#eae5ec", textDecoration: "none", transition: "color 0.3s", wordBreak: "break-all" }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
                  onMouseLeave={e => e.currentTarget.style.color = "#eae5ec"}>
                  bhimannavarsudeep26@gmail.com
                </a>
              </div>
              <div>
                <p style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>Phone</p>
                <a href="tel:+917760531692" style={{ fontSize: "clamp(14px,1.3vw,17px)", color: "#eae5ec", textDecoration: "none", transition: "color 0.3s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
                  onMouseLeave={e => e.currentTarget.style.color = "#eae5ec"}>
                  +91 7760531692
                </a>
              </div>
              <div>
                <p style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>Social</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <a href="https://github.com/Sudeep2642" target="_blank" rel="noopener noreferrer" className="cs" data-hover>GitHub <MdArrowOutward /></a>
                  <a href="https://linkedin.com/in/sudeepbhimannavar-dev26" target="_blank" rel="noopener noreferrer" className="cs" data-hover>LinkedIn <MdArrowOutward /></a>
                  <a href="https://sudeep-bhimannavar.vercel.app" target="_blank" rel="noopener noreferrer" className="cs" data-hover>Portfolio <MdArrowOutward /></a>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200} from="right">
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", maxWidth: 360, width: "100%", gap: 24 }}>
              <div style={{ padding: "28px 24px", border: "1px solid rgba(194,164,255,0.15)", borderRadius: 12, background: "rgba(194,164,255,0.03)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,var(--accent3),var(--accent))" }} />
                <p style={{ fontSize: 12, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16 }}>Currently</p>
                <p style={{ fontSize: "clamp(13px,1vw,15px)", fontWeight: 300, lineHeight: 1.8, color: "rgba(234,229,236,0.7)", margin: 0 }}>
                  Software Engineer at Vividhity Ventures, building AI-powered SaaS products in production. Actively seeking senior full-stack roles.
                </p>
              </div>
              <div>
                <h2 style={{ fontWeight: 400, fontSize: "clamp(13px,1.4vw,18px)", margin: 0, lineHeight: 1.5, color: "rgba(255,255,255,0.7)" }}>
                  Designed &amp; Developed by{" "} <br />
                  <span style={{ color: "var(--accent)" }}>Sudeep Bhimannavar</span>
                </h2>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}