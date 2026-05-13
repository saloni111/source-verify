# Objection — Source Verify

**Anonymous Source Verification System** — Prototyping challenge submission for Objection.

A live prototype that verifies evidence from anonymous sources and generates a privacy-preserving certificate with publication-ready attribution language.

## Live Demo

[source-verify.vercel.app](https://source-verify.vercel.app) *(deployed)*

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

Built using Cursor with Claude Sonnet 4.6. The AI was used to scaffold the full Next.js app structure, design the CSS design system (dark parchment + amber palette derived from objection.ai), implement the verification engine logic (entity/date/claim cross-reference analysis), and iterate on the UI across marketing, verify, and certificate pages. Manual decisions: evidence content extraction from the downloaded package, the specific scoring heuristics, and which attribution formats to include. Cut: backend API, database persistence, real audio forensics, and actual PDF parsing — all deferred to keep the prototype deployable as a static site within the time constraint.
