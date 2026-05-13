# Objection — Source Verify

**Anonymous Source Verification System** — Prototyping challenge submission for Objection.

A live prototype that verifies evidence from anonymous sources and generates a privacy-preserving certificate with publication-ready attribution language.

## Live Demo

[source-verify.vercel.app](https://source-verify.vercel.app)

## What It Does

1. **Secure Intake** — Upload evidence files (text, PDF, audio, documents). Each file is SHA-256 hashed and timestamped immediately upon receipt, establishing provenance.

2. **Verification Engine** — Multi-layer analysis pipeline:
   - Entity cross-reference (names, organizations across documents)
   - Date corroboration and temporal coherence check
   - Claim overlap detection via weighted token matching
   - Per-document reliability scoring with type-specific heuristics
   - Overall confidence score with unidirectional bias detection

3. **Certificate & Attribution** — Privacy-preserving certificate with confidence score, evidence breakdown, and three publication-ready attribution formats journalists can copy directly.

## Evidence Package (Academic Misconduct Scenario)

The sample data is pre-loaded and covers a postdoctoral researcher alleging data fabrication by a PI in a gene therapy paper:

- `journalist_intake_notes.txt` — Journalist's intake and initial assessment
- `email_chain_vasquez_hargrove.pdf` — Primary communications
- `recorded_conversation_march_19.mp3` — Witness corroboration audio
- `data_comparison_memo.docx` — Quantitative discrepancy analysis
- `vasquez_personal_notes.docx` — Contemporaneous dated notes

## Stack

- **Next.js 16** (App Router, static export)
- **Pure CSS** (no UI library) — custom design system matching objection.ai's brand
- **Web Crypto API** — SHA-256 hashing in-browser
- Zero backend, zero database — all analysis is client-side

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## AI Workflow

I used Cursor with Claude Sonnet 4.6 throughout the project, mainly as a thinking partner and implementation assistant. Before writing code, I used it to reason through what “verification” should mean for anonymous source material. The key idea was that verification should not just mean checking whether a file was altered, but whether the full evidence package is internally consistent and difficult to fabricate. That helped shape the scoring model around things like cross-document consistency, repeated entities, timeline coherence, corroboration, and discrepancy patterns. From there, I used AI to help scaffold the app, build the UI, and iterate on the verification engine, while manually reviewing and revising the output. I also pushed back on early suggestions that were too simple, such as basic keyword matching, and refined the system into something more structured and credible. One useful debugging moment was when the AI helped identify a CSS module issue with kebab-case class names in Turbopack. The main architectural decision — keeping the analysis fully client-side so source evidence never leaves the browser — was intentional from the start, because privacy is a core requirement for this type of product.
