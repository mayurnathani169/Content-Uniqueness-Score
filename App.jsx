/**
 * Content Uniqueness Score
 * MIT License — Open Source
 *
 * Tested with: Firecrawl (scraping) + Groq (AI scoring) — both FREE
 * Also works with: OpenAI, Anthropic Claude (paid)
 *
 * Get free Firecrawl key: https://firecrawl.dev
 * Get free Groq key:      https://console.groq.com
 * Get OpenAI key:         https://platform.openai.com (paid)
 * Get Claude key:         https://console.anthropic.com (paid)
 */

import { useState, useEffect, useRef } from "react";

const FIRECRAWL_API_URL = "https://api.firecrawl.dev/v1/scrape";

// AI Provider configs
const AI_PROVIDERS = {
  groq: {
    label: "Groq (Free)",
    badge: "FREE",
    badgeColor: "#00e5a0",
    placeholder: "gsk_xxxxxxxxxxxxxxxx",
    hint: "Free at console.groq.com — no credit card needed",
    url: "https://api.groq.com/openai/v1/chat/completions",
    model: "llama-3.3-70b-versatile",
    format: "openai",
  },
  openai: {
    label: "OpenAI (Paid)",
    badge: "PAID",
    badgeColor: "#f5c542",
    placeholder: "sk-xxxxxxxxxxxxxxxx",
    hint: "Paid key at platform.openai.com",
    url: "https://api.openai.com/v1/chat/completions",
    model: "gpt-4o",
    format: "openai",
  },
  anthropic: {
    label: "Claude / Anthropic (Paid)",
    badge: "PAID",
    badgeColor: "#f5c542",
    placeholder: "sk-ant-xxxxxxxxxxxxxxxx",
    hint: "Paid key at console.anthropic.com",
    url: "https://api.anthropic.com/v1/messages",
    model: "claude-sonnet-4-20250514",
    format: "anthropic",
  },
};

const ANALYSIS_PROMPT = (content) => `You are a strict content quality auditor for small businesses evaluating their SEO agency or writer.

Here is the full blog post content to analyze:

---
${content.slice(0, 6000)}
---

Evaluate this content and return ONLY a valid JSON object. No markdown, no backticks, no explanation whatsoever:

{
  "overall_score": <0-100>,
  "sub_scores": {
    "originality_of_ideas": <0-100>,
    "writing_authenticity": <0-100>,
    "content_depth": <0-100>,
    "brand_voice_presence": <0-100>,
    "generic_phrase_density": <0-100>
  },
  "verdict_summary": "<2-3 sentence plain English verdict>",
  "red_flags": ["<specific flag 1>", "<specific flag 2>", "<specific flag 3>"],
  "what_works": ["<specific point 1>", "<specific point 2>"],
  "hire_verdict": "<HIRE | PROBATION | FIRE>"
}

Scoring guide:
- originality_of_ideas: Fresh angles vs rehashed ideas? (0=pure copy, 100=highly original)
- writing_authenticity: Human and genuine vs templated and robotic? (0=robotic, 100=authentic)
- content_depth: Deep insights vs surface fluff? (0=fluff, 100=deep)
- brand_voice_presence: Specific brand feel vs generic content anyone could write? (0=generic, 100=strong voice)
- generic_phrase_density: HIGH = LOW filler. LOW = stuffed with phrases like "In today's fast-paced world", "It's important to note", "In conclusion"
- hire_verdict: HIRE if overall >= 70, PROBATION if 40-69, FIRE if below 40

Be brutally honest. Small businesses use this to evaluate if their SEO agency is delivering real value or churning recycled content.`;

// ─── Sub components ───────────────────────────────────────────────

const ScoreRing = ({ score, size = 140 }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / 100) * circumference;

  useEffect(() => {
    const duration = 1500;
    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const prog = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - prog, 3);
      setAnimatedScore(Math.round(eased * score));
      if (prog < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score]);

  const getColor = (s) => {
    if (s >= 75) return "#00e5a0";
    if (s >= 50) return "#f5c542";
    if (s >= 25) return "#ff8c42";
    return "#ff4d6d";
  };
  const color = getColor(animatedScore);

  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={radius} fill="none" stroke="#1e2535" strokeWidth="10" />
      <circle cx="60" cy="60" r={radius} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${progress} ${circumference}`} strokeLinecap="round"
        transform="rotate(-90 60 60)" style={{ transition: "stroke 0.5s ease" }} />
      <text x="60" y="56" textAnchor="middle" fill={color} fontSize="22" fontWeight="700" fontFamily="'DM Mono', monospace">{animatedScore}</text>
      <text x="60" y="72" textAnchor="middle" fill="#5a6a8a" fontSize="9" fontFamily="'DM Mono', monospace">OUT OF 100</text>
    </svg>
  );
};

const SubScoreBar = ({ label, score, delay }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), delay);
    return () => clearTimeout(t);
  }, [score, delay]);

  const getColor = (s) => {
    if (s >= 75) return "#00e5a0";
    if (s >= 50) return "#f5c542";
    if (s >= 25) return "#ff8c42";
    return "#ff4d6d";
  };

  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "12px", color: "#8899bb", fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em" }}>{label}</span>
        <span style={{ fontSize: "12px", color: getColor(score), fontFamily: "'DM Mono', monospace", fontWeight: "700" }}>{score}/100</span>
      </div>
      <div style={{ height: "6px", background: "#1e2535", borderRadius: "3px", overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: "3px", background: getColor(score), width: `${width}%`, transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)", boxShadow: `0 0 8px ${getColor(score)}66` }} />
      </div>
    </div>
  );
};

const getVerdict = (score) => {
  if (score >= 75) return { label: "ORIGINAL", color: "#00e5a0", bg: "#00e5a010" };
  if (score >= 50) return { label: "ACCEPTABLE", color: "#f5c542", bg: "#f5c54210" };
  if (score >= 25) return { label: "PARAPHRASED", color: "#ff8c42", bg: "#ff8c4210" };
  return { label: "GARBAGE", color: "#ff4d6d", bg: "#ff4d6d10" };
};

const MaskedInput = ({ label, value, onChange, placeholder, hint }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div style={{ marginBottom: "20px" }}>
      <label style={{ display: "block", fontSize: "11px", color: "#5a6a8a", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", marginBottom: "8px" }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input type={visible ? "text" : "password"} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={{ width: "100%", padding: "12px 56px 12px 16px", background: "#0b0f1a", border: "1px solid #1a2235", borderRadius: "8px", color: "#e0e8ff", fontSize: "14px", fontFamily: "'DM Mono', monospace" }} />
        <button onClick={() => setVisible(v => !v)}
          style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#3a4a6a", cursor: "pointer", fontSize: "11px", fontFamily: "'DM Mono', monospace" }}>
          {visible ? "HIDE" : "SHOW"}
        </button>
      </div>
      {hint && <p style={{ fontSize: "11px", color: "#3a4a6a", margin: "6px 0 0", fontFamily: "'DM Mono', monospace" }}>{hint}</p>}
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────

export default function App() {
  const [firecrawlKey, setFirecrawlKey] = useState("");
  const [aiKey, setAiKey] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("groq");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loadingMsg, setLoadingMsg] = useState("");
  const msgRef = useRef(0);
  const intervalRef = useRef(null);

  const loadingMessages = [
    "Fetching blog via Firecrawl...",
    "Cleaning and extracting text...",
    "Scanning for filler phrases...",
    "Detecting paraphrased patterns...",
    "Checking originality signals...",
    "Analyzing brand voice...",
    "Computing uniqueness score...",
  ];

  useEffect(() => {
    if (loading) {
      msgRef.current = 0;
      setLoadingMsg(loadingMessages[0]);
      intervalRef.current = setInterval(() => {
        msgRef.current = (msgRef.current + 1) % loadingMessages.length;
        setLoadingMsg(loadingMessages[msgRef.current]);
      }, 1800);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [loading]);

  const callAI = async (content, provider, key) => {
    const config = AI_PROVIDERS[provider];
    const prompt = ANALYSIS_PROMPT(content);

    if (config.format === "openai") {
      const res = await fetch(config.url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
        body: JSON.stringify({ model: config.model, messages: [{ role: "user", content: prompt }], temperature: 0.2, max_tokens: 1024 })
      });
      if (!res.ok) { const e = await res.json(); throw new Error(`${config.label} error: ${e?.error?.message || res.statusText}`); }
      const data = await res.json();
      return data.choices?.[0]?.message?.content || "";
    }

    if (config.format === "anthropic") {
      const res = await fetch(config.url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: config.model, max_tokens: 1024, messages: [{ role: "user", content: prompt }] })
      });
      if (!res.ok) { const e = await res.json(); throw new Error(`Claude error: ${e?.error?.message || res.statusText}`); }
      const data = await res.json();
      return data.content?.[0]?.text || "";
    }

    throw new Error("Unknown provider format");
  };

  const analyze = async () => {
    if (!firecrawlKey.trim()) { setError("Please enter your Firecrawl API key."); return; }
    if (!aiKey.trim()) { setError(`Please enter your ${AI_PROVIDERS[selectedProvider].label} API key.`); return; }
    if (!url.trim()) { setError("Please enter a blog URL."); return; }
    setError("");
    setResult(null);
    setLoading(true);

    try {
      // Step 1 — Firecrawl scrapes the blog
      const crawlRes = await fetch(FIRECRAWL_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${firecrawlKey}` },
        body: JSON.stringify({ url, formats: ["markdown"], onlyMainContent: true })
      });
      if (!crawlRes.ok) { const e = await crawlRes.json(); throw new Error(`Firecrawl error: ${e?.error || crawlRes.statusText}`); }
      const crawlData = await crawlRes.json();
      const blogContent = crawlData?.data?.markdown || crawlData?.markdown || "";
      if (!blogContent || blogContent.length < 100) throw new Error("Could not extract content from this URL. Try a different blog post.");

      // Step 2 — AI scores the content
      const raw = await callAI(blogContent, selectedProvider, aiKey);
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);

    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const verdict = result ? getVerdict(result.overall_score) : null;
  const hireColors = { HIRE: "#00e5a0", PROBATION: "#f5c542", FIRE: "#ff4d6d" };
  const hireIcons = { HIRE: "✓", PROBATION: "⚠", FIRE: "✕" };
  const provider = AI_PROVIDERS[selectedProvider];

  return (
    <div style={{ minHeight: "100vh", background: "#0b0f1a", fontFamily: "'DM Sans', sans-serif", color: "#e0e8ff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: #3a4a6a; }
        input, select { outline: none; }
        .scan-line { position: absolute; top: 0; left: -100%; width: 60%; height: 100%; background: linear-gradient(90deg, transparent, rgba(0,229,160,0.06), transparent); animation: scan 2.5s linear infinite; }
        @keyframes scan { to { left: 140%; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .pulse { animation: pulse 1.5s ease infinite; }
        .btn-analyze { width: 100%; padding: 14px; border-radius: 8px; font-family: 'DM Mono', monospace; font-weight: 700; font-size: 14px; letter-spacing: 0.08em; border: none; cursor: pointer; transition: all 0.2s; }
        .btn-analyze:hover:not(:disabled) { box-shadow: 0 0 20px #00e5a055; transform: translateY(-1px); }
        .btn-analyze:disabled { background: #1e2535 !important; color: #3a4a6a !important; cursor: not-allowed; }
        .provider-tab { padding: 8px 14px; border-radius: 6px; border: 1px solid #1a2235; background: transparent; color: #5a6a8a; cursor: pointer; font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.05em; transition: all 0.2s; }
        .provider-tab:hover { border-color: #2a3550; color: #8899bb; }
        .provider-tab.active { background: #0f1525; border-color: #00e5a033; color: #e0e8ff; }
        .api-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 600px) { .api-grid { grid-template-columns: 1fr; } .results-grid { grid-template-columns: 1fr !important; } .score-grid { grid-template-columns: 1fr !important; } .provider-tabs { flex-wrap: wrap; } }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1a2235", padding: "20px 32px", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00e5a0", boxShadow: "0 0 10px #00e5a0" }} />
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: "800", letterSpacing: "0.1em" }}>CONTENT UNIQUENESS SCORE</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ fontSize: "10px", color: "#3a4a6a", fontFamily: "'DM Mono', monospace", padding: "3px 8px", border: "1px solid #1a2235", borderRadius: "4px" }}>FIRECRAWL</span>
          <span style={{ fontSize: "10px", color: "#00e5a0", fontFamily: "'DM Mono', monospace", padding: "3px 8px", border: "1px solid #00e5a033", borderRadius: "4px" }}>OPEN SOURCE</span>
        </div>
      </div>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "48px 24px" }}>

        {/* Hero */}
        <div style={{ marginBottom: "48px" }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(26px, 5vw, 46px)", fontWeight: "800", lineHeight: 1.1, margin: "0 0 16px" }}>
            Is your agency writing<br />
            <span style={{ color: "#00e5a0" }}>real content</span> or just<br />
            <span style={{ color: "#ff4d6d" }}>recycled garbage?</span>
          </h1>
          <p style={{ color: "#5a6a8a", fontSize: "15px", lineHeight: 1.7, maxWidth: "540px", margin: 0 }}>
            Paste any blog URL. Firecrawl extracts the content, AI scores it brutally. Know in seconds if your writer deserves to keep the contract.
          </p>
        </div>

        {/* Input Card */}
        <div style={{ background: "#0f1525", border: "1px solid #1a2235", borderRadius: "16px", padding: "32px", marginBottom: "32px", position: "relative", overflow: "hidden" }}>
          <div className="scan-line" />

          {/* Firecrawl Key */}
          <MaskedInput
            label="FIRECRAWL API KEY"
            value={firecrawlKey}
            onChange={setFirecrawlKey}
            placeholder="fc-xxxxxxxxxxxxxxxx"
            hint="Free at firecrawl.dev (500 scrapes free, no credit card)"
          />

          {/* AI Provider Selector */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "11px", color: "#5a6a8a", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", marginBottom: "12px" }}>AI PROVIDER</label>
            <div className="provider-tabs" style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
              {Object.entries(AI_PROVIDERS).map(([key, p]) => (
                <button key={key} className={`provider-tab ${selectedProvider === key ? "active" : ""}`}
                  onClick={() => { setSelectedProvider(key); setAiKey(""); setError(""); }}>
                  {p.label}
                  <span style={{ marginLeft: "6px", fontSize: "9px", padding: "2px 5px", borderRadius: "3px", background: `${p.badgeColor}22`, color: p.badgeColor, fontWeight: "700" }}>{p.badge}</span>
                </button>
              ))}
            </div>

            <p style={{ fontSize: "11px", color: "#3a4a6a", fontFamily: "'DM Mono', monospace", margin: "0 0 16px", padding: "10px 14px", background: "#00e5a008", border: "1px solid #00e5a015", borderRadius: "6px" }}>
              ✅ Tested with Firecrawl + Groq — both free, no credit card needed. OpenAI and Claude are also supported if you want to experiment, but require paid API keys.
            </p>
            <MaskedInput
              label={`${provider.label.toUpperCase()} API KEY`}
              value={aiKey}
              onChange={setAiKey}
              placeholder={provider.placeholder}
              hint={provider.hint}
            />
          </div>

          {/* URL */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "11px", color: "#5a6a8a", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", marginBottom: "8px" }}>BLOG URL TO ANALYZE</label>
            <input type="url" value={url} onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !loading && analyze()}
              placeholder="https://youragency.com/blog/some-post"
              style={{ width: "100%", padding: "12px 16px", background: "#0b0f1a", border: "1px solid #1a2235", borderRadius: "8px", color: "#e0e8ff", fontSize: "14px", fontFamily: "'DM Mono', monospace" }} />
          </div>

          <button className="btn-analyze" onClick={analyze} disabled={loading}
            style={{ background: loading ? "#1e2535" : "#00e5a0", color: loading ? "#3a4a6a" : "#0b0f1a" }}>
            {loading ? "ANALYZING..." : "ANALYZE CONTENT →"}
          </button>

          {loading && (
            <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <div className="pulse" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00e5a0", flexShrink: 0 }} />
              <span style={{ fontSize: "12px", color: "#5a6a8a", fontFamily: "'DM Mono', monospace" }}>{loadingMsg}</span>
            </div>
          )}

          {error && (
            <div style={{ marginTop: "16px", padding: "12px 16px", background: "#ff4d6d10", border: "1px solid #ff4d6d33", borderRadius: "8px" }}>
              <span style={{ fontSize: "13px", color: "#ff4d6d", fontFamily: "'DM Mono', monospace" }}>{error}</span>
            </div>
          )}
        </div>

        {/* Results */}
        {result && verdict && (
          <div className="fade-up">
            <div className="score-grid" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "24px", background: "#0f1525", border: "1px solid #1a2235", borderRadius: "16px", padding: "32px", marginBottom: "20px", alignItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <ScoreRing score={result.overall_score} />
                <div style={{ marginTop: "8px", fontSize: "11px", color: "#5a6a8a", fontFamily: "'DM Mono', monospace" }}>OVERALL SCORE</div>
              </div>
              <div>
                <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: "4px", background: verdict.bg, border: `1px solid ${verdict.color}33`, marginBottom: "12px" }}>
                  <span style={{ fontSize: "11px", fontFamily: "'DM Mono', monospace", fontWeight: "700", color: verdict.color, letterSpacing: "0.1em" }}>{verdict.label}</span>
                </div>
                <p style={{ margin: "0 0 16px", fontSize: "14px", color: "#8899bb", lineHeight: 1.7 }}>{result.verdict_summary}</p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "8px", background: `${hireColors[result.hire_verdict]}15`, border: `1px solid ${hireColors[result.hire_verdict]}44` }}>
                  <span style={{ fontSize: "16px", color: hireColors[result.hire_verdict] }}>{hireIcons[result.hire_verdict]}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: "700", fontSize: "13px", color: hireColors[result.hire_verdict] }}>
                    WRITER VERDICT: {result.hire_verdict}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ background: "#0f1525", border: "1px solid #1a2235", borderRadius: "16px", padding: "32px", marginBottom: "20px" }}>
              <h3 style={{ margin: "0 0 24px", fontSize: "11px", color: "#5a6a8a", fontFamily: "'DM Mono', monospace", letterSpacing: "0.12em" }}>PARAMETER BREAKDOWN</h3>
              <SubScoreBar label="ORIGINALITY OF IDEAS" score={result.sub_scores.originality_of_ideas} delay={100} />
              <SubScoreBar label="WRITING AUTHENTICITY" score={result.sub_scores.writing_authenticity} delay={200} />
              <SubScoreBar label="CONTENT DEPTH" score={result.sub_scores.content_depth} delay={300} />
              <SubScoreBar label="BRAND VOICE PRESENCE" score={result.sub_scores.brand_voice_presence} delay={400} />
              <SubScoreBar label="GENERIC PHRASE DENSITY" score={result.sub_scores.generic_phrase_density} delay={500} />
            </div>

            <div className="results-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
              <div style={{ background: "#0f1525", border: "1px solid #ff4d6d22", borderRadius: "16px", padding: "24px" }}>
                <h3 style={{ margin: "0 0 16px", fontSize: "11px", color: "#ff4d6d", fontFamily: "'DM Mono', monospace", letterSpacing: "0.12em" }}>🚩 RED FLAGS</h3>
                {result.red_flags.map((flag, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
                    <span style={{ color: "#ff4d6d", fontSize: "12px", marginTop: "2px", flexShrink: 0 }}>—</span>
                    <span style={{ fontSize: "13px", color: "#8899bb", lineHeight: 1.5 }}>{flag}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "#0f1525", border: "1px solid #00e5a022", borderRadius: "16px", padding: "24px" }}>
                <h3 style={{ margin: "0 0 16px", fontSize: "11px", color: "#00e5a0", fontFamily: "'DM Mono', monospace", letterSpacing: "0.12em" }}>✓ WHAT WORKS</h3>
                {result.what_works.map((point, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
                    <span style={{ color: "#00e5a0", fontSize: "12px", marginTop: "2px", flexShrink: 0 }}>—</span>
                    <span style={{ fontSize: "13px", color: "#8899bb", lineHeight: 1.5 }}>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <button onClick={() => { setResult(null); setUrl(""); setError(""); }}
                style={{ background: "none", border: "1px solid #1a2235", color: "#5a6a8a", padding: "10px 24px", borderRadius: "8px", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: "12px", letterSpacing: "0.08em" }}>
                ANALYZE ANOTHER URL
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
