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

I used Cursor with Claude Sonnet 4.6 the whole way through — and honestly, the most valuable moment wasn't in the code at all. It was before I wrote a single line. I dumped the full evidence package into context and just had a conversation: what does "verified" actually mean for anonymous source material? Not just "this file hasn't been tampered with" — but does this set of documents hang together in a way a fabricated package probably wouldn't? That conversation is what surfaced the right primitives. Entity co-occurrence across documents, directional bias in discrepancies, temporal span versus temporal consistency — those became the engine's actual scoring dimensions. That kind of domain-to-data-model translation is usually where I'd spend hours reading and thinking alone. Having something to argue with compressed it significantly.

On the implementation side, I kept the AI in a tight loop — scaffolding, CSS system, component structure — reviewed everything, and pushed back hard when it gave me the obvious answer. The first draft of the verification engine was basically "count matching keywords." I had to explicitly reframe the problem before it got to something structurally interesting. One thing it caught that I genuinely missed: a Turbopack CSS module behavior where kebab-case class names fail silently — no build error, nothing. Would've been a frustrating thirty-minute debug. The bigger architectural call, though — keeping the entire analysis client-side so no evidence ever touches a server — that was mine, and I made it before writing anything. Because for a source protection product, that's not a tradeoff. That's a constraint.
