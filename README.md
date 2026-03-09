# Content Uniqueness Score 🔍

> **Is your agency writing real content or just recycled garbage?**

An open-source tool that audits any blog URL and gives it a brutal, honest uniqueness score. Built for small businesses to evaluate whether their SEO agency or writer is delivering real value — or just churning out paraphrased, generic content.

![MIT License](https://img.shields.io/badge/license-MIT-00e5a0.svg)
![Free to use](https://img.shields.io/badge/free%20to%20use-Firecrawl%20%2B%20Groq-00e5a0.svg)

---

## 🚀 What It Does

Paste any blog URL → the tool fetches the full content → an AI model scores it across 5 parameters → you get a verdict in seconds.

### Scoring Parameters

| Parameter | What It Measures |
|---|---|
| **Originality of Ideas** | Fresh angles vs rehashed ideas everyone already said |
| **Writing Authenticity** | Human and genuine vs templated and robotic |
| **Content Depth** | Deep insights vs surface-level fluff |
| **Brand Voice Presence** | Specific brand feel vs generic content anyone could write |
| **Generic Phrase Density** | Low filler score = stuffed with "In today's fast-paced world..." |

### Final Verdict
- ✅ **HIRE** — Score 70+, content is solid
- ⚠️ **PROBATION** — Score 40–69, needs improvement
- ❌ **FIRE** — Score below 40, recycled garbage

---

## 🛠️ Tech Stack

- **React + Vite** — Frontend
- **Firecrawl** — Scrapes and cleans blog content from any URL
- **AI Provider of your choice** — Scores the content

---

## 🔑 API Keys Required

You need two API keys to run this tool. All keys are entered by the user in the UI — **nothing is hardcoded or stored anywhere.**

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

> ✅ **Tested with Firecrawl + Groq** — both free, no credit card, works globally. If you want to test with OpenAI or Anthropic Claude, those are supported too but require paid API keys.

---

## ⚡ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) v18 or higher

### Installation

```bash
# Clone the repo
git clone https://github.com/YOURUSERNAME/content-uniqueness-score.git

# Navigate into the project
cd content-uniqueness-score

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
5. Get your score, breakdown, red flags, and verdict

---

## 📁 Project Structure

```
content-uniqueness-score/
├── src/
│   ├── App.jsx        # Main application
│   └── main.jsx       # React entry point
├── public/
├── LICENSE            # MIT License
├── README.md
└── package.json
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Open issues for bugs or feature requests
- Submit pull requests
- Suggest new AI providers to support
- Improve the scoring prompt

---

## 📄 License

MIT License — free to use, modify, and distribute. See [LICENSE](./LICENSE) for details.

---

## 💡 Inspired By

The frustration of small businesses paying $2,000–$10,000/month to SEO agencies that deliver generic, copy-pasted blog content with no original thinking. This tool gives businesses a way to hold their writers accountable with objective, data-driven scores.
