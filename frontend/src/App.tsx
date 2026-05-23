import InstallBanner from "./components/InstallBanner";
import NearbyLegalAid from "./components/NearbyLegalAid";
import TeleLawPanel from "./components/TeleLawPanel";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── VOICE HELPERS ──────────────────────────────────────
type RecordingState = "idle" | "recording" | "transcribing";
type SpeakingState = "idle" | "loading" | "playing";

function useVoiceRecorder(onTranscribed: (text: string) => void) {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [micError, setMicError] = useState("");
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    setMicError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Use supported mimeType — webm works on Chrome, ogg on Firefox
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/ogg";

      const recorder = new MediaRecorder(stream, { mimeType });
      chunks.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunks.current, { type: mimeType });
        if (blob.size < 100) {
          setRecordingState("idle");
          setMicError("Recording too short. Please try again.");
          return;
        }
        setRecordingState("transcribing");
        try {
          const form = new FormData();
          form.append("audio", blob, "recording.webm");
          const res = await fetch("http://127.0.0.1:8000/voice/transcribe", {
            method: "POST",
            body: form,
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || `Server error: ${res.status}`);
          }
          const data = await res.json();
          if (data.transcribed_text) {
            onTranscribed(data.transcribed_text);
          } else {
            setMicError("Could not understand speech. Please try again.");
          }
        } catch (e: any) {
          setMicError(e.message || "Transcription failed. Check backend.");
        }
        setRecordingState("idle");
      };
      mediaRecorder.current = recorder;
      recorder.start();
      setRecordingState("recording");
    } catch (e: any) {
      if (e.name === "NotAllowedError") {
        setMicError("Microphone access denied. Allow mic in browser settings.");
      } else if (e.name === "NotFoundError") {
        setMicError("No microphone found. Please connect a microphone.");
      } else {
        setMicError("Could not start microphone. Try refreshing the page.");
      }
    }
  }, [onTranscribed]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current?.state === "recording") {
      mediaRecorder.current.stop();
    }
  }, []);

  const toggleRecording = useCallback(() => {
    if (recordingState === "recording") stopRecording();
    else if (recordingState === "idle") startRecording();
  }, [recordingState, startRecording, stopRecording]);

  return { recordingState, micError, toggleRecording };
}

function useVoiceSpeaker() {
  const [speakingState, setSpeakingState] = useState<SpeakingState>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback(async (text: string, language: string = "auto") => {
    // If already playing, stop it
    if (speakingState === "playing") {
      audioRef.current?.pause();
      if (audioRef.current?.src) URL.revokeObjectURL(audioRef.current.src);
      setSpeakingState("idle");
      return;
    }
    setSpeakingState("loading");
    try {
      const res = await fetch("http://127.0.0.1:8000/voice/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.slice(0, 1500), language }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `TTS error: ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { setSpeakingState("idle"); URL.revokeObjectURL(url); };
      audio.onerror = () => { setSpeakingState("idle"); URL.revokeObjectURL(url); };
      await audio.play();
      setSpeakingState("playing");
    } catch (e: any) {
      console.warn("[TTS]", e.message);
      setSpeakingState("idle");
    }
  }, [speakingState]);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    setSpeakingState("idle");
  }, []);

  return { speakingState, speak, stop };
}

// ─── WHATSAPP ICON ────────────────────────────────────────
const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.532 5.845L.057 23.885l6.19-1.453A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.741 9.741 0 0 1-5.028-1.396l-.36-.214-3.732.876.936-3.615-.235-.373A9.715 9.715 0 0 1 2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/>
  </svg>
);

// ─── CONSTANTS ───────────────────────────────────────────
const API = "http://127.0.0.1:8000";

const AGENTS = [
  { id: 1, name: "Language",   full: "Language Agent",   desc: "Detecting & translating",            icon: "◎", color: "#FF6B1A" },
  { id: 2, name: "Classifier", full: "Classifier Agent", desc: "Identifying legal domain",            icon: "◈", color: "#E85D04" },
  { id: 3, name: "Research",   full: "Research Agent",   desc: "Searching BNS · BNSS · Constitution", icon: "◉", color: "#DC2F02" },
  { id: 4, name: "Explainer",  full: "Rights Explainer", desc: "Translating law to plain language",   icon: "◍", color: "#9D0208" },
  { id: 5, name: "Drafter",    full: "Document Drafter", desc: "Generating legal document",           icon: "◌", color: "#370617" },
];

const SAMPLES = [
  { lang: "EN",  label: "English", text: "My landlord is not returning my security deposit. What are my rights?", domain: "Consumer"    },
  { lang: "বাং", label: "Bengali", text: "আমার জমি জোর করে দখল করা হয়েছে। আমি কী করতে পারি?",                  domain: "Land Rights" },
  { lang: "हि",  label: "Hindi",   text: "मेरे नियोक्ता ने मुझे बिना नोटिस के निकाल दिया। मेरे क्या अधिकार हैं?", domain: "Labour"   },
  { lang: "ଓ",   label: "Odia",    text: "ମୋ ଜମି ଅଧିକାର ଅଛି କି?",                                                domain: "Land Rights" },
];

const STATS = [
  { value: "1.4B", label: "Indians served" },
  { value: "22+",  label: "Languages"      },
  { value: "5",    label: "AI Agents"      },
  { value: "0₹",   label: "Cost to user"   },
];

type AgentStatus = "idle" | "running" | "done";
type Result = {
  detected_lang: string;
  domain: string;
  explanation: string;
  document: string;
  sources: { source: string; section: string; similarity: number }[];
  severity_score: number;
  retrieval_confidence: number;
};

// ─── PARTICLE CANVAS ──────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.4 + 0.05,
      hue: Math.random() > 0.5 ? 25 : 120,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},80%,55%,${p.alpha})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,107,26,${0.08 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

// ─── TYPEWRITER ───────────────────────────────────────────
function Typewriter({ texts }: { texts: string[] }) {
  const [idx, setIdx]           = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting]   = useState(false);
  useEffect(() => {
    const current = texts[idx];
    const timer = setTimeout(() => {
      if (!deleting && displayed.length < current.length) {
        setDisplayed(current.slice(0, displayed.length + 1));
      } else if (!deleting && displayed.length === current.length) {
        setTimeout(() => setDeleting(true), 2000);
      } else if (deleting && displayed.length > 0) {
        setDisplayed(displayed.slice(0, -1));
      } else {
        setDeleting(false);
        setIdx((idx + 1) % texts.length);
      }
    }, deleting ? 30 : 60);
    return () => clearTimeout(timer);
  }, [displayed, deleting, idx, texts]);
  return <span className="typewriter">{displayed}<span className="cursor">|</span></span>;
}

// ─── MAIN APP ─────────────────────────────────────────────
export default function App({ user, onLogout }: { user?: any; onLogout?: () => void }) {
  const [question, setQuestion]       = useState("");
  const [agentStatus, setAgentStatus] = useState<AgentStatus[]>(["idle","idle","idle","idle","idle"]);
  const [currentAgent, setCurrentAgent] = useState(-1);
  const [result, setResult]           = useState<Result | null>(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [activeTab, setActiveTab]     = useState<"explanation"|"document"|"sources">("explanation");
  const [copied, setCopied]           = useState(false);
  const [agentLog, setAgentLog]       = useState<string[]>([]);
  const resultRef                     = useRef<HTMLDivElement>(null);
  const textareaRef                   = useRef<HTMLTextAreaElement>(null);

  const addLog = (msg: string) => setAgentLog(prev => [...prev.slice(-6), msg]);

  const handleTranscribed = useCallback((text: string) => {
    if (text) setQuestion(text);
  }, []);

  const { recordingState, micError, toggleRecording } = useVoiceRecorder(handleTranscribed);
  const { speakingState, speak, stop: stopSpeaking }  = useVoiceSpeaker();

  const handleSubmit = async () => {
    if (!question.trim() || loading) return;
    setAgentStatus(["idle","idle","idle","idle","idle"]);
    setCurrentAgent(-1);
    setResult(null);
    setError("");
    setAgentLog([]);
    setLoading(true);

    // Fire API immediately — don't await animation
    const apiPromise = fetch(`${API}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: question.trim(), language: "auto" }),
    });

    // Animate agent pipeline
    const delays = [0, 1200, 2400, 4000, 6000];
    const logs   = [
      "Language detection initiated...",
      "Legal domain classified...",
      "Vector search across legal corpora...",
      "Synthesizing rights explanation...",
      "Drafting formal legal document...",
    ];
    delays.forEach((delay, i) => {
      setTimeout(() => {
        setCurrentAgent(i);
        setAgentStatus(prev => prev.map((s, idx) => idx === i ? "running" : idx < i ? "done" : "idle"));
        addLog(logs[i]);
      }, delay);
      setTimeout(() => {
        setAgentStatus(prev => prev.map((_, idx) => idx <= i ? "done" : "idle"));
      }, delay + 1000);
    });

    try {
      const res = await apiPromise;
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Server error: ${res.status}`);
      }
      const data: Result = await res.json();
      setTimeout(() => {
        setResult(data);
        setActiveTab("explanation");
        setLoading(false);
        setCurrentAgent(-1);
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      }, 7500);
    } catch (e: any) {
      setTimeout(() => {
        setError(e.message || "Backend error. Is your server running on port 8000?");
        setLoading(false);
        setCurrentAgent(-1);
      }, 1000);
    }
  };

  const downloadDoc = () => {
    if (!result) return;
    const blob = new Blob([result.document], { type: "text/plain;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `nyayswarm_${result.domain}_document.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      <InstallBanner />
      <ParticleCanvas />
      <div className="noise" />

      {/* ── HEADER ── */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-mark">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="white" strokeWidth="1.5"/>
                <path d="M6 10h8M10 6v8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="logo-text">NyaySwarm</span>
            <span className="logo-badge">BETA</span>
          </div>
          <nav className="nav">
            <span>English</span><span>বাংলা</span><span>हिन्दी</span><span>ଓଡ଼ିଆ</span>
          </nav>
          {user && (
            <div className="user-row">
              <div className="user-avatar">
                {(user.user_metadata?.full_name || user.email || "U")[0].toUpperCase()}
              </div>
              <span className="user-name">
                {user.user_metadata?.full_name || user.email?.split("@")[0]}
              </span>
              <button className="logout-btn" onClick={onLogout}>Sign out</button>
            </div>
          )}
          <div className="header-status">
            <div className="status-dot" />
            <span>5 Agents Online</span>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-eyebrow">
          <span className="eyebrow-dot" />
          India's First Multi-Agent Legal AI
        </div>
        <h1 className="hero-title">
          Legal Aid for<br />
          <span className="gradient-text">
            <Typewriter texts={["Every Indian.", "Rural India.", "Odia Speakers.", "Bengali Speakers.", "Hindi Speakers."]} />
          </span>
        </h1>
        <p className="hero-sub">
          Ask any legal question in your language. Our Swarm Orchestra of 5 specialist AI agents
          searches Indian law, explains your rights, and drafts your legal document — in seconds.
        </p>
        <div className="stats-row">
          {STATS.map((s, i) => (
            <div key={i} className="stat">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MAIN ── */}
      <main className="main">

        {/* Architecture strip */}
        <div className="arch-strip">
          <div className="arch-label">SWARM ORCHESTRA ARCHITECTURE</div>
          <div className="arch-flow">
            <div className="arch-node user-node">USER QUERY</div>
            <div className="arch-arrow">→</div>
            <div className="arch-node orchestrator-node">ORCHESTRATOR</div>
            <div className="arch-arrow">→</div>
            {AGENTS.map((a, i) => (
              <div key={i} style={{ display: "contents" }}>
                <div
                  className={`arch-node agent-node ${currentAgent === i ? "arch-active" : agentStatus[i] === "done" ? "arch-done" : ""}`}
                  style={{ "--ac": a.color } as any}
                >
                  {a.name}
                </div>
                {i < 4 && <div className="arch-arrow">→</div>}
              </div>
            ))}
            <div className="arch-arrow">→</div>
            <div className="arch-node output-node">OUTPUT</div>
          </div>
        </div>

        {/* Input panel */}
        <div className="input-panel">
          <div className="input-panel-left">
            <div className="panel-header">
              <span className="panel-num">01</span>
              <span className="panel-title">State Your Legal Situation</span>
            </div>

            <div className="textarea-wrap">
              <textarea
                ref={textareaRef}
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="Describe your legal problem in any language…"
                rows={5}
                onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) handleSubmit(); }}
                disabled={loading || recordingState === "transcribing"}
              />
              {recordingState === "transcribing" && (
                <div className="transcribing-overlay">
                  <span className="spinner" /> Converting speech to text...
                </div>
              )}
              <div className="char-count">{question.length} chars</div>
            </div>

            {micError && <div className="mic-error">⚠ {micError}</div>}

            <div className="input-actions">
              <span className="kbd-hint">⌘ Ctrl+Enter to submit</span>
              <div className="input-actions-right">
                <button
                  className={`mic-btn ${recordingState === "recording" ? "mic-active" : ""} ${recordingState === "transcribing" ? "mic-transcribing" : ""}`}
                  onClick={toggleRecording}
                  disabled={loading || recordingState === "transcribing"}
                  title={recordingState === "recording" ? "Stop recording" : "Speak your question"}
                >
                  {recordingState === "recording" ? (
                    <><span className="mic-icon-active">◉</span><span className="mic-bars"><span/><span/><span/><span/></span></>
                  ) : recordingState === "transcribing" ? (
                    <span className="spinner" />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                      <line x1="12" y1="19" x2="12" y2="23"/>
                      <line x1="8" y1="23" x2="16" y2="23"/>
                    </svg>
                  )}
                </button>
                <button
                  className="submit-btn"
                  onClick={handleSubmit}
                  disabled={loading || !question.trim()}
                >
                  {loading
                    ? <><span className="spinner" /> Swarm Working...</>
                    : <>Activate Swarm <span className="btn-arrow">↗</span></>
                  }
                </button>
              </div>
            </div>

            {recordingState === "recording" && (
              <div className="recording-indicator">
                <span className="rec-dot" />
                <span>Listening in your language… tap mic to stop</span>
              </div>
            )}
          </div>

          <div className="input-panel-right">
            <div className="panel-header">
              <span className="panel-num">02</span>
              <span className="panel-title">Quick Examples</span>
            </div>
            <div className="sample-grid">
              {SAMPLES.map((s, i) => (
                <button key={i} className="sample-card"
                  onClick={() => { setQuestion(s.text); textareaRef.current?.focus(); }}>
                  <div className="sample-top">
                    <span className="sample-lang-badge">{s.lang}</span>
                    <span className="sample-domain">{s.domain}</span>
                  </div>
                  <p className="sample-text">{s.text}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pipeline panel */}
        <div className={`pipeline-panel ${loading ? "pipeline-active" : ""}`}>
          <div className="panel-header">
            <span className="panel-num">03</span>
            <span className="panel-title">Swarm Pipeline</span>
            {loading && <span className="live-badge">● LIVE</span>}
          </div>
          <div className="pipeline-agents">
            {AGENTS.map((agent, i) => (
              <div key={i} className={`pipeline-agent pa-${agentStatus[i]}`} style={{ "--ac": agent.color } as any}>
                <div className="pa-header">
                  <span className="pa-icon">{agent.icon}</span>
                  <span className="pa-num">A{agent.id}</span>
                  {agentStatus[i] === "running" && <span className="pa-spinner" />}
                  {agentStatus[i] === "done"    && <span className="pa-check">✓</span>}
                </div>
                <div className="pa-name">{agent.full}</div>
                <div className="pa-desc">{agent.desc}</div>
                {i < 4 && <div className="pa-connector" />}
              </div>
            ))}
          </div>
          <div className="agent-log">
            {agentLog.length === 0 && !loading
              ? <span className="log-idle">— Awaiting query —</span>
              : agentLog.map((log, i) => (
                  <div key={i} className="log-line">
                    <span className="log-time">{String(i + 1).padStart(2, "0")}</span>
                    <span>{log}</span>
                  </div>
                ))
            }
            {loading && <div className="log-cursor">▌</div>}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="error-panel">
            <span className="error-icon">⚠</span>
            <div>
              <div className="error-title">Request Failed</div>
              <div className="error-msg">{error}</div>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="result-panel" ref={resultRef}>
            <div className="panel-header result-header">
              <span className="panel-num">04</span>
              <span className="panel-title">NyaySwarm Response</span>
              <div className="result-meta-pills">
                <span className="meta-pill lang-pill">🌐 {result.detected_lang}</span>
                <span className="meta-pill domain-pill">⚖ {result.domain?.replace(/_/g, " ")}</span>
                <span className="meta-pill source-pill">📚 {result.sources?.length || 0} sections</span>
              </div>
            </div>

            <div className="result-tabs">
              {([
                { id: "explanation", label: "Your Rights",     icon: "💡" },
                { id: "document",    label: "Legal Document",  icon: "📄" },
                { id: "sources",     label: "Law Sources",     icon: "📚" },
              ] as const).map(tab => (
                <button key={tab.id}
                  className={`rtab ${activeTab === tab.id ? "rtab-active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}>
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            <div className="result-body">
              {activeTab === "explanation" && (
                <div className="explanation-view">
                  <button
                    className={`listen-btn ${speakingState === "playing" ? "listen-playing" : ""}`}
                    onClick={() => speakingState === "playing"
                      ? stopSpeaking()
                      : speak(result.explanation, result.detected_lang)}
                    disabled={speakingState === "loading"}
                  >
                    {speakingState === "loading" ? <><span className="spinner" /> Generating audio...</>
                     : speakingState === "playing" ? <>■ Stop Listening</>
                     : <>🔊 Listen to your rights</>}
                  </button>
                  {result.explanation.split("\n").filter(l => l.trim()).map((line, i) => (
                    <div key={i} className={`exp-line ${line.startsWith("•") || line.startsWith("-") || line.startsWith("*") ? "exp-bullet" : "exp-para"}`}>
                      {line}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "document" && (
                <div className="document-view">
                  <div className="doc-toolbar">
                    <div className="doc-toolbar-left">
                      <span className="doc-type-badge">📄 {result.domain?.replace(/_/g, " ").toUpperCase()} DOCUMENT</span>
                    </div>
                    <div className="doc-toolbar-right">
                      <button className="tool-btn" onClick={() => {
                        navigator.clipboard.writeText(result.document);
                        setCopied(true); setTimeout(() => setCopied(false), 2000);
                      }}>
                        {copied ? "✓ Copied" : "Copy"}
                      </button>
                      <button className="whatsapp-btn" onClick={() => {
                        const text = `*NyaySwarm Legal Document*\n\n${result.document}\n\n_Generated by NyaySwarm — Free AI Legal Aid for India_\n_NALSA Helpline: 15100_`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                      }}>
                        <WhatsAppIcon /> Share
                      </button>
                      <button className="tool-btn tool-btn-primary" onClick={downloadDoc}>↓ Download</button>
                    </div>
                  </div>
                  <pre className="doc-content">{result.document}</pre>
                </div>
              )}

              {activeTab === "sources" && (
                <div className="sources-view">
                  <div className="sources-header-note">Retrieved from embedded Indian legal corpus via vector similarity search</div>
                  {result.sources?.map((s, i) => (
                    <div key={i} className="source-row">
                      <div className="source-rank">{String(i + 1).padStart(2, "0")}</div>
                      <div className="source-info">
                        <div className="source-name">{s.source?.toUpperCase()}</div>
                        <div className="source-section">{s.section}</div>
                      </div>
                      <div className="source-score">
                        <div className="score-bar-bg">
                          <div className="score-bar-fill" style={{ width: `${Math.round((s.similarity || 0) * 100)}%` }} />
                        </div>
                        <span className="score-pct">{Math.round((s.similarity || 0) * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="nalsa-strip">
              <div className="nalsa-left">
                <span className="nalsa-icon">🆘</span>
                <div>
                  <div className="nalsa-title">Need Immediate Legal Help?</div>
                  <div className="nalsa-sub">NALSA Tele-Law Helpline — Free, confidential, available in all Indian languages</div>
                </div>
              </div>
              <div className="nalsa-number">15100</div>
            </div>
          </div>
        )}

        {result && (
          <TeleLawPanel
            domain={result.domain}
            severityScore={result.severity_score || 0}
            retrievalConfidence={result.retrieval_confidence || 0.8}
            userState={user?.user_metadata?.state}
            detectedLang={result.detected_lang}
          />
        )}
        {/* Nearby Legal Aid — appears after result */}
        {result && (
          <NearbyLegalAid userState={user?.user_metadata?.state} />
        )}
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">NyaySwarm — AI Legal Aid for Rural India</div>
          <div className="footer-stack">
            {["React", "FastAPI", "Groq Llama3", "Supabase pgvector", "Trae.ai"].map((t, i) => (
              <span key={i} className="stack-chip">{t}</span>
            ))}
          </div>
          <div className="footer-copy">Built for HackArena 2.0 · Kolkata Zonals 2026</div>
        </div>
      </footer>
    </div>
  );
}
