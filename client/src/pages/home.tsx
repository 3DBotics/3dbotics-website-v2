import React, { useState, useEffect, useRef } from "react";
import logoImage from "@assets/2026_3DBotics®_LOGO_1766703414890.jpg";
import founderImage from "@assets/veni_founder.jpg";
import slider1 from "@assets/slider_1.jpg";
import slider2 from "@assets/slider_2.jpg";
import slider3 from "@assets/slider_3.jpg";
import slider4 from "@assets/slider_4.jpg";
import chatbotAvatar from "@assets/Gemini_Generated_Image_8t7xmn8t7xmn8t7x_1766711043630.png";
import { SiFacebook } from "react-icons/si";
import { Menu, X, ChevronRight, MapPin, Mail, Phone } from "lucide-react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const C = {
  navy:   "#0B1628",
  navyMid: "#111E35",
  teal:   "#4BBFBF",
  tealDim: "rgba(75,191,191,0.12)",
  gold:   "#F5B400",
  goldDim: "rgba(245,180,0,0.12)",
  coral:  "#E84C24",
  coralDim: "rgba(232,76,36,0.12)",
  lime:   "#A8C23A",
  limeDim: "rgba(168,194,58,0.12)",
  white:  "#FFFFFF",
  offWhite: "#F7F9FC",
  gray:   "#6B7A99",
  gridLine: "rgba(255,255,255,0.05)",
};

const syne = "'Syne', sans-serif";
const dm   = "'DM Sans', sans-serif";

// ─── INJECT FONTS ────────────────────────────────────────────────────────────
if (typeof document !== "undefined" && !document.getElementById("3db-fonts")) {
  const link = document.createElement("link");
  link.id = "3db-fonts";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap";
  document.head.appendChild(link);
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "About", href: "#about" },
    { label: "Programs", href: "#programs" },
    { label: "TechDojo", href: "#techdojo" },
    { label: "Videos", href: "#videos" },
    { label: "Branches", href: "#branches" },
    { label: "Contact", href: "#contact" },
  ];

  const navStyle: React.CSSProperties = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    height: 64,
    background: scrolled ? "rgba(11,22,40,0.97)" : "transparent",
    backdropFilter: scrolled ? "blur(12px)" : "none",
    borderBottom: scrolled ? `1px solid ${C.gridLine}` : "none",
    transition: "all 0.3s ease",
    fontFamily: dm,
  };

  return (
    <nav style={navStyle}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="#home" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src={logoImage} alt="3DBotics" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.teal}` }} />
          <span style={{ fontFamily: syne, fontWeight: 800, fontSize: 18, color: C.white }}>3DBotics<sup style={{ fontSize: 10, color: C.teal }}>®</sup></span>
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="desktop-nav">
          {links.map(l => (
            <a key={l.label} href={l.href} style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, fontWeight: 500, textDecoration: "none", letterSpacing: "0.02em", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.white)}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
            >{l.label}</a>
          ))}
          <a href="https://portal.3dbotics.ph" target="_blank" rel="noopener noreferrer"
            style={{ background: C.teal, color: C.navy, fontWeight: 700, fontSize: 13, padding: "8px 20px", borderRadius: 6, textDecoration: "none", fontFamily: syne, letterSpacing: "0.03em", transition: "opacity 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >Enter Portal →</a>
        </div>

        <button onClick={() => setOpen(!open)} style={{ display: "none", background: "none", border: "none", color: C.white, cursor: "pointer" }} className="mobile-menu-btn">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div style={{ background: C.navyMid, padding: "16px 24px 24px", borderTop: `1px solid ${C.gridLine}` }}>
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}
              style={{ display: "block", color: C.white, padding: "12px 0", fontSize: 15, fontWeight: 500, textDecoration: "none", borderBottom: `1px solid ${C.gridLine}` }}>
              {l.label}
            </a>
          ))}
          <a href="https://portal.3dbotics.ph" target="_blank" rel="noopener noreferrer"
            style={{ display: "block", marginTop: 16, background: C.teal, color: C.navy, fontWeight: 700, padding: "12px 0", borderRadius: 6, textAlign: "center", textDecoration: "none", fontFamily: syne }}>
            Enter Portal →
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

// ─── ANIMATED COUNTER ────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = Math.ceil(to / 60);
      const timer = setInterval(() => {
        start = Math.min(start + step, to);
        setVal(start);
        if (start >= to) clearInterval(timer);
      }, 16);
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const slides = [slider1, slider2, slider3, slider4];
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSlide(p => (p + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="home" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", background: C.navy, fontFamily: dm }}>
      {/* Background slideshow */}
      {slides.map((s, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, backgroundImage: `url(${s})`, backgroundSize: "cover", backgroundPosition: "center", opacity: i === slide ? 0.18 : 0, transition: "opacity 1.2s ease", zIndex: 0 }} />
      ))}
      {/* Grid overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${C.gridLine} 1px, transparent 1px)`, backgroundSize: "60px 60px", zIndex: 1 }} />
      {/* Gradient fade */}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 50%, ${C.navy} 100%)`, zIndex: 2 }} />

      <div style={{ position: "relative", zIndex: 3, maxWidth: 1200, margin: "0 auto", padding: "120px 24px 80px", width: "100%" }}>
        {/* Eyebrow */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.tealDim, border: `1px solid ${C.teal}40`, borderRadius: 4, padding: "6px 14px", marginBottom: 28 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.teal }} />
          <span style={{ color: C.teal, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Philippines' #1 STEM Franchise</span>
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily: syne, fontWeight: 800, fontSize: "clamp(40px, 7vw, 80px)", lineHeight: 1.05, color: C.white, margin: "0 0 12px", maxWidth: 800 }}>
          Where Kids Build<br />
          <span style={{ color: C.teal }}>Tomorrow's Tech</span><br />
          <span style={{ color: C.gold }}>Today.</span>
        </h1>

        <p style={{ fontSize: "clamp(16px, 2vw, 19px)", color: "rgba(255,255,255,0.65)", maxWidth: 520, lineHeight: 1.7, margin: "20px 0 40px" }}>
          3D Printing · Artificial Intelligence · Kit-Free Robotics · Game & App Development — taught in a structured belt-rank system that keeps kids coming back.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 64 }}>
          <a href="#programs" style={{ background: C.teal, color: C.navy, fontFamily: syne, fontWeight: 700, fontSize: 15, padding: "14px 28px", borderRadius: 6, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, transition: "opacity 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
            Explore Programs <ChevronRight size={16} />
          </a>
          <a href="https://franchise.3dbotics.ph" target="_blank" rel="noopener noreferrer"
            style={{ background: "transparent", color: C.white, fontFamily: syne, fontWeight: 700, fontSize: 15, padding: "14px 28px", borderRadius: 6, textDecoration: "none", border: `1px solid rgba(255,255,255,0.25)`, display: "inline-flex", alignItems: "center", gap: 8, transition: "border-color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = C.white)} onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)")}>
            Own a Franchise →
          </a>
        </div>

        {/* Live stats ticker */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 1, background: C.gridLine, border: `1px solid ${C.gridLine}`, borderRadius: 8, overflow: "hidden", maxWidth: 700 }}>
          {[
            { label: "Active Branches", val: 52, suffix: "+" },
            { label: "Students Trained", val: 10000, suffix: "+" },
            { label: "Cities Nationwide", val: 28, suffix: "" },
            { label: "Valuation", val: 316, suffix: "M ₱" },
          ].map(s => (
            <div key={s.label} style={{ background: "rgba(11,22,40,0.8)", padding: "20px 20px 16px", backdropFilter: "blur(8px)" }}>
              <div style={{ fontFamily: syne, fontWeight: 800, fontSize: 28, color: C.teal, lineHeight: 1 }}>
                <Counter to={s.val} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: 11, color: C.gray, marginTop: 6, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION WRAPPER ─────────────────────────────────────────────────────────
function Section({ id, bg, children, py = 96 }: { id?: string; bg?: string; children: React.ReactNode; py?: number }) {
  return (
    <section id={id} style={{ background: bg ?? C.offWhite, padding: `${py}px 0`, fontFamily: dm }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>{children}</div>
    </section>
  );
}

function SectionLabel({ text, color = C.teal }: { text: string; color?: string }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
      <div style={{ width: 24, height: 2, background: color }} />
      <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color }}>{text}</span>
    </div>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function About() {
  return (
    <Section id="about" bg={C.offWhite}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="about-grid">
        <div>
          <SectionLabel text="Who We Are" />
          <h2 style={{ fontFamily: syne, fontWeight: 800, fontSize: "clamp(28px, 4vw, 44px)", color: C.navy, lineHeight: 1.1, margin: "0 0 20px" }}>
            A New Standard in<br />Kids' Tech Education
          </h2>
          <p style={{ color: "#445566", lineHeight: 1.8, fontSize: 16, margin: "0 0 16px" }}>
            3DBotics® is the Philippines' pioneering STEM franchise combining 3D printing, artificial intelligence, kit-free robotics, and game development into one structured learning system modeled after martial arts — with a Labgown rank system that keeps students engaged and progressing.
          </p>
          <p style={{ color: "#445566", lineHeight: 1.8, fontSize: 16, margin: "0 0 32px" }}>
            Our TechDojo program is designed for ages 6–16 and operates in 52+ branches nationwide, making advanced technology education fun, tangible, and genuinely career-relevant.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { label: "IPOPHL Trademark Registered", color: C.teal },
              { label: "China–Japan Standard", color: C.gold },
              { label: "Industry 4.0 Aligned", color: C.coral },
            ].map(b => (
              <span key={b.label} style={{ fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 4, background: b.color + "15", color: b.color, border: `1px solid ${b.color}35` }}>{b.label}</span>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { icon: "🎯", label: "Mission", desc: "Equip Filipino youth with future-ready skills" },
            { icon: "🤖", label: "Method", desc: "Hands-on builds, not passive screen time" },
            { icon: "🏋️", label: "Structure", desc: "Belt-rank Labgown progression system" },
            { icon: "🌏", label: "Scale", desc: "52+ branches & expanding fast" },
          ].map(c => (
            <div key={c.label} style={{ background: C.white, border: "1px solid #E8ECF4", borderRadius: 10, padding: 24 }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{c.icon}</div>
              <div style={{ fontFamily: syne, fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: 6 }}>{c.label}</div>
              <div style={{ fontSize: 13, color: C.gray, lineHeight: 1.6 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:768px){.about-grid{grid-template-columns:1fr!important;gap:40px!important}}`}</style>
    </Section>
  );
}

// ─── PROGRAMS ────────────────────────────────────────────────────────────────
function Programs() {
  const progs = [
    { icon: "🖨️", title: "3D Designing & Printing", color: C.gold, desc: "From Tinkercad concepts to physical objects. Students design, slice, and print their own creations — understanding materials, tolerances, and manufacturing principles." },
    { icon: "🧠", title: "AI-Assisted Coding", color: C.teal, desc: "AI prompting, logic building, and system design. Students learn to work with AI as a tool — not just use it passively — building real applications." },
    { icon: "⚙️", title: "Kit-Free Robotics", color: C.coral, desc: "No pre-packaged kits. Students build robots from scratch using raw components — wiring, sensors, motors — and compete in structured sparring matches." },
    { icon: "🎮", title: "Game & Mobile App AI Dev", color: C.lime, desc: "From game design to mobile deployment. Students create interactive experiences powered by AI, learning the full product development lifecycle." },
  ];
  return (
    <Section id="programs" bg={C.navy} py={96}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <SectionLabel text="4 Technologies · 1 System" color={C.teal} />
        <h2 style={{ fontFamily: syne, fontWeight: 800, fontSize: "clamp(28px, 4vw, 48px)", color: C.white, margin: "0 0 16px", lineHeight: 1.1 }}>
          The Complete Future-Ready<br />Curriculum
        </h2>
        <p style={{ color: C.gray, fontSize: 16, maxWidth: 480, margin: "0 auto" }}>Four emerging technologies taught together — because that's how the real world works.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 2, background: C.gridLine, border: `1px solid ${C.gridLine}`, borderRadius: 10, overflow: "hidden" }}>
        {progs.map((p, i) => (
          <div key={i} style={{ background: C.navyMid, padding: 32, transition: "background 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#161f35")}
            onMouseLeave={e => (e.currentTarget.style.background = C.navyMid)}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>{p.icon}</div>
            <div style={{ width: 28, height: 3, background: p.color, borderRadius: 2, marginBottom: 14 }} />
            <h3 style={{ fontFamily: syne, fontWeight: 700, fontSize: 18, color: C.white, margin: "0 0 12px", lineHeight: 1.3 }}>{p.title}</h3>
            <p style={{ color: C.gray, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── LABGOWN RANK SYSTEM ─────────────────────────────────────────────────────
function LabgownSystem() {
  const ranks = [
    { color: "#F5F5F0", label: "White", desc: "Entry level · 24 hrs" },
    { color: "#22C55E", label: "Green", desc: "Core skills · 36 hrs" },
    { color: "#EAB308", label: "Yellow", desc: "Intermediate · 72 hrs" },
    { color: "#3B82F6", label: "Blue", desc: "Advanced · 120 hrs" },
    { color: "#EF4444", label: "Red", desc: "Expert · 180 hrs" },
    { color: "#1F2937", label: "Black", desc: "Master · 360 hrs" },
  ];
  const [current, setCurrent] = useState(0);
  const slides = [18,19,20,22,23,24,25,26,27,28,29,30,31,32];
  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p+1) % slides.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <Section id="techdojo" bg={C.offWhite}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }} className="rank-grid">
        <div>
          <SectionLabel text="TechDojo Rank System" />
          <h2 style={{ fontFamily: syne, fontWeight: 800, fontSize: "clamp(26px, 3.5vw, 40px)", color: C.navy, margin: "0 0 16px", lineHeight: 1.1 }}>
            Martial Arts Structure.<br />Tech Superpowers.
          </h2>
          <p style={{ color: "#445566", lineHeight: 1.8, fontSize: 15, margin: "0 0 32px" }}>
            Students progress through 6 Labgown ranks — just like a martial arts dojo. Each rank requires attendance hours, sparring wins, project approval, and a written exam. No shortcuts. Real achievement.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {ranks.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: C.white, border: "1px solid #E8ECF4", borderRadius: 8, transition: "border-color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = r.color === "#F5F5F0" ? "#ccc" : r.color)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#E8ECF4")}>
                <div style={{ width: 32, height: 32, borderRadius: 6, background: r.color, border: "1px solid rgba(0,0,0,0.1)", flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: syne, fontWeight: 700, fontSize: 14, color: C.navy }}>{r.label} Labgown</div>
                  <div style={{ fontSize: 12, color: C.gray }}>{r.desc}</div>
                </div>
                <div style={{ marginLeft: "auto", fontSize: 11, color: C.gray, fontWeight: 600 }}>RANK {i+1}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ borderRadius: 10, overflow: "hidden", position: "relative", aspectRatio: "16/9", background: C.navy, boxShadow: "0 24px 64px rgba(0,0,0,0.15)" }}>
            {slides.map((num, i) => (
              <img key={num} src={`/assets/td_slide_${num}.jpg`} alt={`Slide ${i+1}`}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: i === current ? 1 : 0, transition: "opacity 0.6s ease" }} />
            ))}
            <button onClick={() => setCurrent(p => (p-1+slides.length)%slides.length)}
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 18, zIndex: 5 }}>‹</button>
            <button onClick={() => setCurrent(p => (p+1)%slides.length)}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 18, zIndex: 5 }}>›</button>
            <div style={{ position: "absolute", bottom: 10, right: 12, background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: 11, padding: "3px 8px", borderRadius: 10, zIndex: 5 }}>{current+1}/{slides.length}</div>
          </div>
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 14, flexWrap: "wrap" }}>
            {slides.map((_,i) => <button key={i} onClick={() => setCurrent(i)} style={{ width: 8, height: 8, borderRadius: "50%", border: "none", cursor: "pointer", background: i === current ? C.teal : "#CBD5E1", transition: "all 0.2s", transform: i === current ? "scale(1.3)" : "scale(1)" }} />)}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.rank-grid{grid-template-columns:1fr!important;gap:40px!important}}`}</style>
    </Section>
  );
}

// ─── FOUNDER ─────────────────────────────────────────────────────────────────
function Founder() {
  return (
    <Section bg={C.navy}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="founder-grid">
        <div style={{ position: "relative" }}>
          <img src={founderImage} alt="Veni Flores" style={{ width: "100%", borderRadius: 10, objectFit: "cover", display: "block", filter: "contrast(1.05)" }} />
          <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: "40%", background: `linear-gradient(to top, ${C.navy}, transparent)` }} />
          <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
            <div style={{ fontFamily: syne, fontWeight: 800, fontSize: 20, color: C.white }}>Veni Flores</div>
            <div style={{ fontSize: 13, color: C.teal, fontWeight: 600 }}>CEO & Founder, 3DBotics®</div>
          </div>
        </div>
        <div>
          <SectionLabel text="The Founder" color={C.gold} />
          <h2 style={{ fontFamily: syne, fontWeight: 800, fontSize: "clamp(26px, 3.5vw, 40px)", color: C.white, margin: "0 0 20px", lineHeight: 1.15 }}>
            Built From a Home<br />3D Printing Farm.<br /><span style={{ color: C.gold }}>Scaled to a Movement.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.8, fontSize: 15, margin: "0 0 16px" }}>
            During the pandemic, Veni Flores turned his home into the largest 3D printing farm in the Philippines — Toydemic. That experiment became the seed of 3DBotics®.
          </p>
          <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.8, fontSize: 15, margin: "0 0 16px" }}>
            An internationally recognized public speaker, bestselling author, and business mentor with 30+ years of experience, Veni brings world-class entrepreneurship to grassroots education.
          </p>
          <div style={{ background: C.goldDim, border: `1px solid ${C.gold}40`, borderRadius: 8, padding: "20px 24px", marginTop: 24 }}>
            <div style={{ fontFamily: syne, fontWeight: 800, fontSize: 32, color: C.gold }}>₱316M</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>Company valuation · March 17, 2026 · 2nd Anniversary</div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.founder-grid{grid-template-columns:1fr!important;gap:40px!important}}`}</style>
    </Section>
  );
}

// ─── SHOWCASE ────────────────────────────────────────────────────────────────
function Showcase() {
  const [posts, setPosts] = useState<any[]>([]);
  const [stats, setStats] = useState({ branches: 52, creations: 169, reactions: 1015 });
  const fallback = [
    'https://iolgjxjjgsynisqtrzit.supabase.co/storage/v1/object/public/project-photos/showcase/student/1779183410250.jpg',
    'https://iolgjxjjgsynisqtrzit.supabase.co/storage/v1/object/public/project-photos/showcase/student/1779436513510.jpg',
    'https://iolgjxjjgsynisqtrzit.supabase.co/storage/v1/object/public/project-photos/showcase/student/1779267912444.jpg',
    'https://iolgjxjjgsynisqtrzit.supabase.co/storage/v1/object/public/project-photos/showcase/student/1779257533081.jpg',
    'https://iolgjxjjgsynisqtrzit.supabase.co/storage/v1/object/public/project-photos/showcase/student/1779104529431.jpg',
    'https://iolgjxjjgsynisqtrzit.supabase.co/storage/v1/object/public/project-photos/showcase/student/1779353615297.jpg',
    'https://iolgjxjjgsynisqtrzit.supabase.co/storage/v1/object/public/project-photos/showcase/staff/1779193821172.jpg',
    'https://iolgjxjjgsynisqtrzit.supabase.co/storage/v1/object/public/project-photos/showcase/student/1779346722900.jpg',
  ];

  useEffect(() => {
    fetch('https://portal.3dbotics.ph/api/showcase/preview')
      .then(r => r.json())
      .then(d => { setPosts((d.posts ?? []).slice(0, 8)); setStats({ branches: d.branches ?? 52, creations: d.creations ?? 169, reactions: d.reactions ?? 1015 }); })
      .catch(() => {});
  }, []);

  const imgs = posts.length > 0 ? posts.map(p => ({ url: p.photo_url, name: p.student_name })) : fallback.map(url => ({ url, name: "Student" }));

  return (
    <Section bg={C.navy} py={96}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", marginBottom: 64 }} className="showcase-grid">
        <div>
          <SectionLabel text="Student Creations" color={C.gold} />
          <h2 style={{ fontFamily: syne, fontWeight: 800, fontSize: "clamp(28px, 4vw, 44px)", color: C.white, margin: "0 0 16px", lineHeight: 1.1 }}>
            Real Robots.<br />Real Kids.<br /><span style={{ color: C.gold }}>Real Results.</span>
          </h2>
          <p style={{ color: C.gray, lineHeight: 1.8, fontSize: 15, margin: "0 0 32px" }}>Every creation in our Showcase Wall was built by a 3DBotics student — not a demo, not stock content. Parents and investors can see actual output from actual children.</p>
          <div style={{ display: "flex", gap: 32, marginBottom: 32 }}>
            {[
              { label: "Branches", val: stats.branches },
              { label: "Creations", val: stats.creations },
              { label: "Reactions", val: stats.reactions },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: syne, fontWeight: 800, fontSize: 32, color: C.gold }}><Counter to={s.val} /></div>
                <div style={{ fontSize: 12, color: C.gray, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <a href="https://portal.3dbotics.ph/showcase" target="_blank" rel="noopener noreferrer"
            style={{ background: C.gold, color: C.navy, fontFamily: syne, fontWeight: 700, fontSize: 14, padding: "12px 24px", borderRadius: 6, textDecoration: "none", display: "inline-block", transition: "opacity 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
            View Full Showcase Wall →
          </a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {imgs.slice(0, 6).map((img, i) => (
            <a key={i} href="https://portal.3dbotics.ph/showcase" target="_blank" rel="noopener noreferrer"
              style={{ borderRadius: 8, overflow: "hidden", aspectRatio: "1", display: "block", position: "relative", gridColumn: i === 0 ? "span 2" : "span 1", gridRow: i === 0 ? "span 1" : "span 1" }}>
              <img src={img.url} alt={img.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
            </a>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:768px){.showcase-grid{grid-template-columns:1fr!important;gap:40px!important}}`}</style>
    </Section>
  );
}

// ─── LEADERBOARD ─────────────────────────────────────────────────────────────
function Leaderboard({ data }: { data: any[] }) {
  if (!data.length) return null;
  return (
    <Section bg={C.offWhite} py={80}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <SectionLabel text="Global Rankings" />
        <h2 style={{ fontFamily: syne, fontWeight: 800, fontSize: "clamp(24px, 3vw, 36px)", color: C.navy, margin: 0 }}>Top Performers Across All Branches</h2>
      </div>
      <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", gap: 8 }}>
        {data.map((e, i) => {
          const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i+1}`;
          return (
            <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: C.white, border: "1px solid #E8ECF4", borderRadius: 8 }}>
              <div style={{ width: 32, textAlign: "center", fontSize: i < 3 ? 18 : 13, fontWeight: 700, color: C.gray, flexShrink: 0 }}>{medal}</div>
              <div style={{ width: 36, height: 36, borderRadius: 8, overflow: "hidden", flexShrink: 0, border: `2px solid ${e.level_color ?? C.teal}` }}>
                {e.photo_url ? <img src={e.photo_url} alt={e.full_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", background: e.level_color ?? C.teal, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: syne, fontWeight: 800, color: "#fff", fontSize: 14 }}>{e.full_name[0]}</div>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: syne, fontWeight: 700, fontSize: 14, color: C.navy, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.full_name}</div>
                <div style={{ fontSize: 12, color: C.gray }}>{e.branch_name} · {e.level_name} Labgown</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: syne, fontWeight: 800, fontSize: 20, color: C.teal }}>{e.sparks}</div>
                <div style={{ fontSize: 11, color: C.gray }}>sparks</div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

// ─── VIDEOS ───────────────────────────────────────────────────────────────────
function Videos() {
  return (
    <Section id="videos" bg={C.navy} py={80}>
      <SectionLabel text="Watch" color={C.teal} />
      <h2 style={{ fontFamily: syne, fontWeight: 800, fontSize: "clamp(24px, 3vw, 36px)", color: C.white, margin: "0 0 40px" }}>See TechDojo in Action</h2>
      <div style={{ borderRadius: 10, overflow: "hidden", maxWidth: 800, boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}>
        <div style={{ aspectRatio: "16/9" }}>
          <iframe src="https://player.vimeo.com/video/1149372357" style={{ width: "100%", height: "100%", border: "none" }} allow="autoplay; fullscreen" allowFullScreen title="Welcome to 3DBotics TechDojo" />
        </div>
        <div style={{ background: C.navyMid, padding: "16px 20px" }}>
          <div style={{ fontFamily: syne, fontWeight: 700, fontSize: 15, color: C.white }}>Welcome to 3DBotics® TechDojo</div>
        </div>
      </div>
    </Section>
  );
}

// ─── BRANCHES ────────────────────────────────────────────────────────────────
const BRANCHES = [
  { name: "Nuvali, Sta. Rosa (Main)", contact: "0915 775 5321", address: "Unit 8 Level 2 Laguna Central Mall, Sta. Rosa City, Laguna" },
  { name: "Makati", contact: "0917 887 9576", address: "Unit 127, Mile-Long Building, Amorsolo St., Legaspi Village, Makati City" },
  { name: "Mandaluyong", contact: "0917 578 1611", address: "6th Floor, 6E MG Tower II, Shaw Blvd., Mandaluyong City" },
  { name: "Quezon City", contact: "0977 832 4211", address: "3rd Floor, Fishermall, Quezon City" },
  { name: "Tacloban City", contact: "0917 850 2008", address: "Ground Floor, Primark Center, Caibaan, Tacloban City" },
  { name: "Imus, Cavite", contact: "0956 895 0278", address: "#2 Sampaguita St., Bayan Luma 8, Imus, Cavite" },
  { name: "Cabuyao, Laguna", contact: "0917 574 3761", address: "LI Building 2, Southpoint Banay-Banay, Cabuyao, Laguna" },
  { name: "Ormoc City", contact: "0917 896 1768", address: "Unit 113, UGF Chinatown East Gate, Lilia Ave., Ormoc City, Leyte" },
  { name: "Las Piñas", contact: "0998 530 9437", address: "Las Piñas City" },
  { name: "Sto. Tomas, Batangas", contact: "0945 289 0343", address: "Kiwi St., The Mango Grove Subd., Sto. Tomas City, Batangas" },
  { name: "San Pablo, Laguna", contact: "0945 289 0343", address: "4 Lt. Brion St., Brgy. III-F, San Pablo City, Laguna" },
  { name: "Bacoor, Cavite", contact: "0917 532 4671", address: "Main Square Mall, 2nd Level, Bacoor Blvd., Bacoor City, Cavite" },
  { name: "Parañaque City", contact: "0962 629 8135", address: "2F Unit 2, El Grande Arcade, BF Homes, Parañaque City" },
];

function Branches() {
  return (
    <Section id="branches" bg={C.offWhite}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
        <div>
          <SectionLabel text="Locations" />
          <h2 style={{ fontFamily: syne, fontWeight: 800, fontSize: "clamp(24px, 3vw, 36px)", color: C.navy, margin: 0 }}>Operational Branches</h2>
        </div>
        <div style={{ background: C.tealDim, border: `1px solid ${C.teal}40`, borderRadius: 6, padding: "10px 18px", textAlign: "center" }}>
          <div style={{ fontFamily: syne, fontWeight: 800, fontSize: 28, color: C.teal }}>40+</div>
          <div style={{ fontSize: 11, color: C.gray, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>More Opening Soon</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {BRANCHES.map((b, i) => (
          <div key={i} style={{ background: C.white, border: "1px solid #E8ECF4", borderRadius: 8, padding: 20, transition: "border-color 0.2s, box-shadow 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.boxShadow = `0 4px 20px ${C.teal}20`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#E8ECF4"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ fontFamily: syne, fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: 8 }}>3DBotics® {b.name}</div>
            <div style={{ fontSize: 12, color: C.gray, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}><Phone size={11} color={C.teal} />{b.contact}</div>
            <div style={{ fontSize: 12, color: C.gray, display: "flex", gap: 6 }}><MapPin size={11} color={C.teal} style={{ flexShrink: 0, marginTop: 2 }} />{b.address}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────
function Testimonials() {
  const t = [
    { quote: "3DBotics transformed my son's interest in technology into a real passion. The hands-on approach is incredible — he actually builds robots, not just watches videos.", author: "Maria Santos", role: "Parent · Greenfields Nuvali Branch" },
    { quote: "As a franchisee, the support and training from 3DBotics is outstanding. It's a business with real impact and strong systems behind it.", author: "John Reyes", role: "TechDojo Franchisee" },
  ];
  return (
    <Section bg={C.navy} py={80}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <SectionLabel text="Testimonials" color={C.gold} />
        <h2 style={{ fontFamily: syne, fontWeight: 800, fontSize: "clamp(24px, 3vw, 36px)", color: C.white, margin: 0 }}>What They're Saying</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
        {t.map((item, i) => (
          <div key={i} style={{ background: C.navyMid, border: `1px solid ${C.gridLine}`, borderRadius: 10, padding: 32 }}>
            <div style={{ fontSize: 40, color: C.gold, lineHeight: 1, marginBottom: 16, fontFamily: syne, fontWeight: 800 }}>"</div>
            <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.75, fontSize: 15, margin: "0 0 24px" }}>{item.quote}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.goldDim, border: `1px solid ${C.gold}40`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: syne, fontWeight: 800, color: C.gold, fontSize: 14 }}>{item.author[0]}</div>
              <div>
                <div style={{ fontFamily: syne, fontWeight: 700, fontSize: 13, color: C.white }}>{item.author}</div>
                <div style={{ fontSize: 12, color: C.gray }}>{item.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function Contact() {
  return (
    <Section id="contact" bg={C.offWhite}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }} className="contact-grid">
        <div>
          <SectionLabel text="Contact" />
          <h2 style={{ fontFamily: syne, fontWeight: 800, fontSize: "clamp(24px, 3vw, 36px)", color: C.navy, margin: "0 0 16px" }}>Let's Talk</h2>
          <p style={{ color: "#445566", lineHeight: 1.8, fontSize: 15, margin: "0 0 32px" }}>Whether you're a parent curious about enrollment, an entrepreneur interested in franchising, or an investor exploring opportunities — we'd love to hear from you.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { icon: <MapPin size={16} color={C.teal} />, label: "Address", val: "3DBotics 2nd Floor Laguna Central Shopping Mall\nDon Jose Street, Paseo De Sta Rosa Greenfield\nSanta Rosa Laguna, Philippines" },
              { icon: <Mail size={16} color={C.teal} />, label: "Email", val: "3dbotics.LC@gmail.com" },
              { icon: <Phone size={16} color={C.teal} />, label: "Phone", val: "0995 836 2249" },
            ].map(c => (
              <div key={c.label} style={{ display: "flex", gap: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: C.tealDim, border: `1px solid ${C.teal}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{c.icon}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.gray, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{c.label}</div>
                  <div style={{ fontSize: 14, color: C.navy, lineHeight: 1.6, whiteSpace: "pre-line" }}>{c.val}</div>
                </div>
              </div>
            ))}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.gray, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Follow Us</div>
              <a href="https://www.facebook.com/share/14TWvvRRUpB/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#1877F220", border: "1px solid #1877F240", borderRadius: 8, padding: "8px 14px", color: "#1877F2", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                <SiFacebook size={16} /> Facebook Page
              </a>
            </div>
          </div>
        </div>
        <div style={{ background: C.navy, borderRadius: 10, padding: 40 }}>
          <h3 style={{ fontFamily: syne, fontWeight: 800, fontSize: 22, color: C.white, margin: "0 0 8px" }}>Inquire About a Franchise</h3>
          <p style={{ color: C.gray, fontSize: 14, margin: "0 0 28px" }}>Ready to own a TechDojo center? Let's start the conversation.</p>
          <a href="https://franchise.3dbotics.ph" target="_blank" rel="noopener noreferrer"
            style={{ display: "block", background: C.teal, color: C.navy, fontFamily: syne, fontWeight: 700, fontSize: 15, padding: "14px", borderRadius: 6, textAlign: "center", textDecoration: "none", marginBottom: 12, transition: "opacity 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
            Visit Franchise Site →
          </a>
          <a href="https://portal.3dbotics.ph" target="_blank" rel="noopener noreferrer"
            style={{ display: "block", background: "transparent", color: C.white, fontFamily: syne, fontWeight: 700, fontSize: 15, padding: "14px", borderRadius: 6, textAlign: "center", textDecoration: "none", border: `1px solid rgba(255,255,255,0.2)`, transition: "border-color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = C.white)} onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}>
            Student / Franchisee Portal →
          </a>
        </div>
      </div>
      <style>{`@media(max-width:768px){.contact-grid{grid-template-columns:1fr!important;gap:40px!important}}`}</style>
    </Section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: C.navy, borderTop: `1px solid ${C.gridLine}`, padding: "32px 24px", fontFamily: dm }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={logoImage} alt="3DBotics" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", border: `1.5px solid ${C.teal}` }} />
          <span style={{ fontFamily: syne, fontWeight: 700, fontSize: 14, color: C.white }}>3DBotics<sup style={{ fontSize: 9, color: C.teal }}>®</sup></span>
          <span style={{ fontSize: 12, color: C.gray }}>· 3D Printing · AI · Robotics</span>
        </div>
        <span style={{ fontSize: 12, color: C.gray }}>© 2026 3DBotics Corporation. All rights reserved.</span>
      </div>
    </footer>
  );
}

// ─── CHATBOT ─────────────────────────────────────────────────────────────────
function Chatbot() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 200, fontFamily: dm }}>
      {open && (
        <div style={{ position: "absolute", bottom: 72, right: 0, width: 340, height: 580, background: C.white, borderRadius: 12, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.3)", border: `1px solid ${C.teal}40` }}>
          <div style={{ background: C.navy, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <img src={chatbotAvatar} alt="AI" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
            <div>
              <div style={{ fontFamily: syne, fontWeight: 700, fontSize: 13, color: C.white }}>3DBotics Assistant</div>
              <div style={{ fontSize: 11, color: C.teal }}>● Online</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: C.gray, cursor: "pointer" }}><X size={16} /></button>
          </div>
          <iframe src="https://3dbotics.ph/concierge" title="Chatbot" style={{ width: "100%", height: "calc(100% - 56px)", border: "none" }} />
        </div>
      )}
      <button onClick={() => setOpen(!open)} style={{ width: 56, height: 56, borderRadius: "50%", border: `2px solid ${C.teal}`, background: C.navy, cursor: "pointer", overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.3)", transition: "transform 0.2s" }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")} onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
        <img src={chatbotAvatar} alt="Chat" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </button>
      {!open && <div style={{ position: "absolute", bottom: 64, right: 0, background: C.teal, color: C.navy, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 10, whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>Ask Me Anything</div>}
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  useEffect(() => {
    fetch('https://portal.3dbotics.ph/api/leaderboard?scope=network')
      .then(r => r.json())
      .then(d => setLeaderboard((d.leaderboard ?? []).slice(0, 10)))
      .catch(() => {});
  }, []);

  return (
    <div style={{ fontFamily: dm, background: C.navy }}>
      <Nav />
      <Hero />
      <About />
      <Programs />
      <LabgownSystem />
      <Founder />
      <Showcase />
      <Leaderboard data={leaderboard} />
      <Testimonials />
      <Videos />
      <Branches />
      <Contact />
      <Footer />
      <Chatbot />
    </div>
  );
}
