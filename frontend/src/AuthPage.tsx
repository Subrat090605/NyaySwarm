import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

type Mode = "landing" | "login" | "signup" | "otp" | "app";
type Lang = { code: string; label: string; greeting: string; sub: string };

const LANGS: Lang[] = [
  { code: "en", label: "English",  greeting: "Know Your Rights",       sub: "Legal aid in your language" },
  { code: "bn", label: "বাংলা",    greeting: "আপনার অধিকার জানুন",    sub: "আপনার ভাষায় আইনি সহায়তা" },
  { code: "hi", label: "हिन्दी",   greeting: "अपने अधिकार जानें",     sub: "आपकी भाषा में कानूनी सहायता" },
  { code: "or", label: "ଓଡ଼ିଆ",   greeting: "ଆପଣଙ୍କ ଅଧିକାର ଜାଣନ୍ତୁ", sub: "ଆପଣଙ୍କ ଭାଷାରେ ଆଇନ ସହାୟତା" },
];

const STEPS = [
  { icon: "◎", label: "Translate", desc: "Your language" },
  { icon: "◈", label: "Classify",  desc: "Legal domain"  },
  { icon: "◉", label: "Research",  desc: "Indian law"    },
  { icon: "◍", label: "Explain",   desc: "Plain language" },
  { icon: "◌", label: "Draft",     desc: "Legal document" },
];

export default function AuthPage({ onAuth }: { onAuth: (user: any) => void }) {
  const [mode, setMode]           = useState<Mode>("landing");
  const [langIdx, setLangIdx]     = useState(0);
  const [phone, setPhone]         = useState("");
  const [name, setName]           = useState("");
  const [state, setState]         = useState("");
  const [otp, setOtp]             = useState(["","","","","",""]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [isSignup, setIsSignup]   = useState(false);
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPass, setShowPass]   = useState(false);
  const otpRefs                   = useRef<(HTMLInputElement|null)[]>([]);
  const canvasRef                 = useRef<HTMLCanvasElement>(null);

  // Rotate language greeting
  useEffect(() => {
    const t = setInterval(() => setLangIdx(i => (i + 1) % LANGS.length), 2800);
    return () => clearInterval(t);
  }, []);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const pts = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.5 + 0.5, a: Math.random() * 0.3 + 0.05, h: Math.random() > 0.5 ? 25 : 120,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.h},80%,55%,${p.a})`; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) for (let j = i+1; j < pts.length; j++) {
        const dx = pts[i].x-pts[j].x, dy = pts[i].y-pts[j].y, d = Math.sqrt(dx*dx+dy*dy);
        if (d < 110) { ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y);
          ctx.strokeStyle = `rgba(255,107,26,${0.07*(1-d/110)})`; ctx.lineWidth=0.5; ctx.stroke(); }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  // Check existing session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) onAuth(data.session.user);
    });
  }, []);

  const handleEmailAuth = async () => {
    setError(""); setLoading(true);
    try {
      if (isSignup) {
        const { data, error: e } = await supabase.auth.signUp({ email, password,
          options: { data: { full_name: name, state } } });
        if (e) throw e;
        if (data.user) onAuth(data.user);
      } else {
        const { data, error: e } = await supabase.auth.signInWithPassword({ email, password });
        if (e) throw e;
        if (data.user) onAuth(data.user);
      }
    } catch (e: any) {
      setError(e.message || "Authentication failed");
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setError(""); setLoading(true);
    const { error: e } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin }
    });
    if (e) { setError(e.message); setLoading(false); }
  };

  const handleOtpInput = (i: number, val: string) => {
    const v = val.replace(/\D/g, "").slice(-1);
    const next = [...otp]; next[i] = v; setOtp(next);
    if (v && i < 5) otpRefs.current[i+1]?.focus();
    if (!v && i > 0) otpRefs.current[i-1]?.focus();
  };

  const lang = LANGS[langIdx];

  // ── LANDING ──────────────────────────────────────────────────
  if (mode === "landing") return (
    <div className="auth-root">
      <canvas ref={canvasRef} className="auth-canvas" />
      <div className="auth-noise" />

      <header className="auth-header">
        <div className="auth-logo">
          <div className="auth-logo-mark">⚖</div>
          <span className="auth-logo-text">NyaySwarm</span>
          <span className="auth-logo-beta">BETA</span>
        </div>
        <div className="auth-header-right">
          <div className="auth-status-dot" /><span className="auth-status-txt">5 Agents Online</span>
        </div>
      </header>

      <main className="landing-main">
        <div className="landing-eyebrow">
          <span className="eyebrow-pip" />
          India's First Multi-Agent Legal AI
        </div>

        <div className="landing-hero">
          <h1 className="landing-h1">{lang.greeting}</h1>
          <p className="landing-sub">{lang.sub}</p>
        </div>

        <div className="lang-switcher">
          {LANGS.map((l, i) => (
            <button key={i} className={`lang-btn ${i === langIdx ? "lang-active" : ""}`}
              onClick={() => setLangIdx(i)}>{l.label}</button>
          ))}
        </div>

        <div className="landing-stats">
          {[["1.4B","Citizens"], ["22+","Languages"], ["5","AI Agents"], ["0₹","Cost"]].map(([v,l],i) => (
            <div key={i} className="landing-stat">
              <div className="stat-val">{v}</div>
              <div className="stat-lbl">{l}</div>
            </div>
          ))}
        </div>

        <div className="landing-pipeline">
          {STEPS.map((s,i) => (
            <div key={i} className="pipeline-step">
              <div className="ps-icon">{s.icon}</div>
              <div className="ps-label">{s.label}</div>
              <div className="ps-desc">{s.desc}</div>
              {i < 4 && <div className="ps-arr">→</div>}
            </div>
          ))}
        </div>

        <div className="landing-cta">
          <button className="cta-primary" onClick={() => { setIsSignup(true); setMode("login"); }}>
            Get Started Free →
          </button>
          <button className="cta-secondary" onClick={() => { setIsSignup(false); setMode("login"); }}>
            Sign In
          </button>
        </div>

        <p className="landing-footer-note">
          Free for all Indian citizens · No lawyer needed · Secure & private
        </p>
      </main>
    </div>
  );

  // ── AUTH FORM ─────────────────────────────────────────────────
  return (
    <div className="auth-root">
      <canvas ref={canvasRef} className="auth-canvas" />
      <div className="auth-noise" />

      <div className="auth-center">
        <div className="auth-card">

          {/* Logo */}
          <div className="auth-card-logo">
            <div className="auth-logo-mark sm">⚖</div>
            <span className="auth-logo-text">NyaySwarm</span>
          </div>

          <h2 className="auth-card-title">
            {isSignup ? "Create your account" : "Welcome back"}
          </h2>
          <p className="auth-card-sub">
            {isSignup
              ? "Free legal aid in your language, always"
              : "Sign in to access your legal history"}
          </p>

          {/* Google */}
          <button className="google-btn" onClick={handleGoogle} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.5 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.1 17.8 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.4c-.5 2.8-2.1 5.2-4.5 6.8l7 5.4c4.1-3.8 6.5-9.4 6.5-16.2z"/>
              <path fill="#FBBC05" d="M10.6 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.7 10.7l7.9-6.1z"/>
              <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7-5.4c-2 1.4-4.6 2.2-8.2 2.2-6.2 0-11.5-4.2-13.4-9.7l-7.9 6.1C6.6 42.6 14.6 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          <div className="auth-divider"><span>or</span></div>

          {/* Signup extras */}
          {isSignup && (
            <>
              <div className="auth-field">
                <label>Full Name</label>
                <input type="text" placeholder="Your full name" value={name}
                  onChange={e => setName(e.target.value)} />
              </div>
              <div className="auth-field">
                <label>State</label>
                <select value={state} onChange={e => setState(e.target.value)}>
                  <option value="">Select your state</option>
                  {["Odisha","West Bengal","Bihar","Jharkhand","Assam","Uttar Pradesh",
                    "Maharashtra","Tamil Nadu","Karnataka","Andhra Pradesh","Telangana",
                    "Rajasthan","Madhya Pradesh","Gujarat","Punjab","Haryana","Kerala",
                    "Chhattisgarh","Uttarakhand","Himachal Pradesh","Other"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="auth-field">
            <label>Email</label>
            <input type="email" placeholder="your@email.com" value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleEmailAuth()} />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <div className="pass-wrap">
              <input type={showPass ? "text" : "password"} placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleEmailAuth()} />
              <button className="pass-toggle" onClick={() => setShowPass(s => !s)}>
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-submit" onClick={handleEmailAuth}
            disabled={loading || !email || !password}>
            {loading ? <span className="auth-spinner" /> : null}
            {isSignup ? "Create Account" : "Sign In"} →
          </button>

          <div className="auth-switch">
            {isSignup ? "Already have an account?" : "New to NyaySwarm?"}
            <button onClick={() => { setIsSignup(s => !s); setError(""); }}>
              {isSignup ? "Sign in" : "Create free account"}
            </button>
          </div>

          <button className="auth-back" onClick={() => setMode("landing")}>
            ← Back
          </button>

          <p className="auth-legal-note">
            By continuing, you agree our service is for informational purposes only and does not constitute legal advice.
          </p>
        </div>
      </div>
    </div>
  );
}
