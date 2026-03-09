# Content Uniqueness Score 🔍

> **Is your agency writing real content or just recycled garbage?**

An open-source tool that audits any blog URL and scores it against **Google's official E-E-A-T framework** — Experience, Expertise, Authoritativeness, and Trustworthiness. Built for small businesses to evaluate whether their SEO agency or writer is delivering content that Google will actually reward.

![MIT License](https://img.shields.io/badge/license-MIT-00e5a0.svg)
![Free to use](https://img.shields.io/badge/free%20to%20use-Firecrawl%20%2B%20Groq-00e5a0.svg)
![EEAT Powered](https://img.shields.io/badge/scoring-Google%20EEAT-00e5a0.svg)

---

## 💡 The Problem

Your whole SEO strategy may be right — but if Google is rewarding content uniqueness and E-E-A-T, and your agency is delivering generic, paraphrased blogs, you are missing out on traffic your competitors are getting.

Google doesn't ban AI content. But it does penalize content that lacks E-E-A-T — content that doesn't hold real experience, expertise, authority, or trust signals. When your content isn't unique, it doesn't rank. When it doesn't rank, your competitors win.

**That's where this tool helps.** Paste any blog URL, get a brutally honest E-E-A-T score, and make a data-driven decision on whether to keep or fire your writer or agency.

---

## 🚀 What It Does

Paste any blog URL → Firecrawl fetches and cleans the content → AI scores it against Google's E-E-A-T framework → You get a verdict in seconds.

### Google E-E-A-T Scoring Parameters

| Parameter | What It Measures |
|---|---|
| ⚡ **Experience** | Does the content show first-hand knowledge and real examples? |
| 🎓 **Expertise** | Does it demonstrate deep subject knowledge beyond surface facts? |
| 🏆 **Authoritativeness** | Does it feel credible — with sources, bylines, and authority signals? |
| 🔒 **Trustworthiness** | Is it transparent, honest, and created to genuinely help people? |
| 👥 **People-First Content** | Is it written for real users — not just to game search rankings? |

### Two Verdicts on Every Scan

**Writer Verdict:**
- ✅ **HIRE** — Score 70+, content meets E-E-A-T standards
- ⚠️ **PROBATION** — Score 40–69, needs significant improvement
- ❌ **FIRE** — Score below 40, content will hurt your rankings

**Google Verdict:**
- ✅ **HELPFUL** — Google's systems are likely to reward this content
- ⚠️ **NEEDS WORK** — Partially helpful but missing key E-E-A-T signals
- ❌ **UNHELPFUL** — Search-engine-first content Google will not reward

---

## 🛠️ Tech Stack

- **React + Vite** — Frontend
- **Firecrawl** — Scrapes and cleans blog content from any URL
- **AI Provider of your choice** — Scores content against E-E-A-T framework

---

## 🔑 API Keys Required

All keys are entered by the user in the UI — **nothing is hardcoded or stored anywhere.**

### 1. Firecrawl (Scraping) — FREE
Used to fetch and clean the blog content from any URL.
- Go to [firecrawl.dev](https://firecrawl.dev)
- Sign up → Dashboard → API Keys
- **Free tier: 500 scrapes, no credit card needed**

### 2. AI Provider (Scoring) — Choose One

| Provider | Cost | Model Used | Get Key |
|---|---|---|---|
| **Groq** ✅ Recommended | **Free** | `llama-3.3-70b-versatile` | [console.groq.com](https://console.groq.com) |
| **OpenAI** | Paid | `gpt-4o` | [platform.openai.com](https://platform.openai.com) |
| **Anthropic Claude** | Paid | `claude-sonnet-4-20250514` | [console.anthropic.com](https://console.anthropic.com) |

> ✅ **Tested with Firecrawl + Groq** — both free, no credit card, works globally. If you want to experiment with OpenAI or Anthropic Claude, those are supported too but require paid API keys.

---

## ⚡ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) v18 or higher

### Installation

```bash
# Clone the repo
git clone https://github.com/mayurnathani169/Content-Uniqueness-Score.git

# Navigate into the project
cd Content-Uniqueness-Score

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Usage

1. Enter your **Firecrawl API key**
2. Select your **AI provider** and enter its API key
3. Paste a **blog URL**
4. Click **Analyze Content**
5. Get your E-E-A-T score, breakdown, red flags, and verdict

---

## 📁 Project Structure

```
Content-Uniqueness-Score/
├── src/
│   ├── App.jsx        # Main application
│   ├── main.jsx       # React entry point
│   └── index.css      # Base styles
├── public/
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
├── LICENSE            # MIT License
└── README.md
```

---

## 📖 About Google's E-E-A-T

E-E-A-T stands for **Experience, Expertise, Authoritativeness, and Trustworthiness** — the framework Google's quality raters use to evaluate content quality.

**Important:** E-E-A-T is not a direct ranking factor, but Google's automated systems use signals that identify content with good E-E-A-T to determine rankings. Content that lacks E-E-A-T — generic, paraphrased, or mass-produced — is exactly what Google's systems are designed to ignore or demote.

Key E-E-A-T signals this tool checks for:
- First-hand experience and real-world examples
- Deep subject expertise beyond surface-level facts
- Author credentials and transparency
- External sources and citations
- People-first intent vs. search-engine-first manipulation
- Absence of filler phrases and generic patterns

Source: [Google's Creating Helpful Content Guide](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Open issues for bugs or feature requests
- Submit pull requests
- Suggest new AI providers to support
- Improve the E-E-A-T scoring prompt
- Add new scoring parameters

---

## 📄 License

MIT License — free to use, modify, and distribute. See [LICENSE](./LICENSE) for details.

---

## 💡 Inspired By

The frustration of small businesses paying $2,000–$10,000/month to SEO agencies that deliver generic, copy-pasted blog content with no real E-E-A-T signals — content that Google's systems are specifically designed to ignore. This tool gives businesses a way to hold their writers accountable with objective, Google-aligned scores.