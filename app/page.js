import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import styles from "./page.module.css";

function ScoreRing({ score, size = 120, label }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle className="score-ring-bg" cx={size / 2} cy={size / 2} r={radius} />
        <circle
          className="score-ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="score-ring-text">
        {score}
        <span style={{ fontSize: "0.5em", color: "var(--cream-muted)" }}>%</span>
        {label && <div className="score-ring-label">{label}</div>}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className={styles.hero} id="hero">
        <div className={styles.heroBadge}>
          <span className={styles.heroBadgeDot}></span>
          Independent Verification Protocol
        </div>
        <h1>
          Prove the truth.
          <br />
          <span className="text-gradient">Protect the source.</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Cryptographic verification for anonymous source evidence. Establish
          provenance, assess reliability, and generate publication-ready
          attribution — without exposing identity.
        </p>
        <div className={styles.heroActions}>
          <Link href="/verify" className="btn btn-primary btn-lg">
            Start Verification
            <span>→</span>
          </Link>
          <a href="#how-it-works" className="btn btn-secondary btn-lg">
            Learn More
          </a>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <div className={styles.heroStatValue}>SHA-256</div>
            <div className={styles.heroStatLabel}>Hash standard</div>
          </div>
          <div className={styles.heroStat}>
            <div className={styles.heroStatValue}>5-layer</div>
            <div className={styles.heroStatLabel}>Analysis engine</div>
          </div>
          <div className={styles.heroStat}>
            <div className={styles.heroStatValue}>0</div>
            <div className={styles.heroStatLabel}>Source data exposed</div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className={styles.problemSection}>
        <div className="container">
          <div className={styles.problemGrid}>
            <div className={styles.problemContent}>
              <div className="section-label">The Problem</div>
              <h2>Anyone can hash a file after creating it.</h2>
              <p>
                Traditional verification answers only one question:
                &quot;has this file been modified?&quot; It says nothing about
                where it came from, when it was created, or whether its
                content is genuine.
              </p>
              <p>
                Anonymous sources need more. They need a system that proves
                provenance — that establishes <em>when</em> evidence entered
                the verification pipeline, analyzes its internal consistency,
                and issues a tamper-proof certificate — all without revealing
                who they are.
              </p>
            </div>
            <div className={styles.problemVisual}>
              <div className={styles.problemCardStack}>
                <div className={styles.problemItem}>
                  <div className={`${styles.problemIcon} ${styles.problemIconDanger}`}></div>
                  <div>
                    <h4>Provenance Gap</h4>
                    <p>
                      A hash proves integrity, not origin. Without timestamped
                      intake, evidence is indistinguishable from fabrication.
                    </p>
                  </div>
                </div>
                <div className={styles.problemItem}>
                  <div className={`${styles.problemIcon} ${styles.problemIconWarning}`}></div>
                  <div>
                    <h4>Identity Exposure</h4>
                    <p>
                      Traditional submission channels leak metadata — IP addresses,
                      email headers, timestamps — that can deanonymize sources.
                    </p>
                  </div>
                </div>
                <div className={styles.problemItem}>
                  <div className={`${styles.problemIcon} ${styles.problemIconInfo}`}></div>
                  <div>
                    <h4>No Cross-Verification</h4>
                    <p>
                      Individual documents lack context. Only by analyzing evidence
                      as a corroborating package can reliability be assessed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.howSection} id="how-it-works">
        <div className="container">
          <div className="section-header">
            <div className="section-label">How It Works</div>
            <h2>Three steps to verified truth</h2>
            <p>
              From anonymous submission to public certificate — with full
              cryptographic audit trail.
            </p>
          </div>
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <h3>Secure Intake</h3>
              <p>
                Evidence is submitted through an encrypted channel. Each file is
                immediately hashed and timestamped at the moment of receipt.
              </p>
              <div className={styles.stepFeatures}>
                <div className={styles.stepFeature}>SHA-256 fingerprinting</div>
                <div className={styles.stepFeature}>Metadata stripping</div>
                <div className={styles.stepFeature}>Timestamp anchoring</div>
              </div>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <h3>Verification Engine</h3>
              <p>
                Multi-layer analysis assesses internal consistency, cross-document
                corroboration, temporal plausibility, and evidence classification.
              </p>
              <div className={styles.stepFeatures}>
                <div className={styles.stepFeature}>Content consistency</div>
                <div className={styles.stepFeature}>Cross-reference analysis</div>
                <div className={styles.stepFeature}>Reliability scoring</div>
              </div>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <h3>Certificate Issuance</h3>
              <p>
                A privacy-preserving certificate is generated with confidence
                scores, evidence breakdown, and publication-ready attribution.
              </p>
              <div className={styles.stepFeatures}>
                <div className={styles.stepFeature}>Unique certificate ID</div>
                <div className={styles.stepFeature}>Attribution language</div>
                <div className={styles.stepFeature}>Tamper-proof hash</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.featuresSection} id="features">
        <div className="container">
          <div className="section-header">
            <div className="section-label">Capabilities</div>
            <h2>Built for investigative journalism</h2>
            <p>
              Every feature designed to balance transparency with source protection.
            </p>
          </div>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIndex}>01</div>
              <h3>Privacy-First Architecture</h3>
              <p>
                Source identity is never stored. Evidence is processed through
                one-way hashes. Certificates contain only derived assertions,
                never raw data.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIndex}>02</div>
              <h3>Cross-Document Corroboration</h3>
              <p>
                The engine maps relationships between evidence items —
                matching dates, names, claims, and facts across documents to
                assess internal consistency.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIndex}>03</div>
              <h3>Attribution Generator</h3>
              <p>
                Publication-ready language that journalists can paste directly
                into their reporting — sourced, verified, and legally defensible.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIndex}>04</div>
              <h3>Tamper Detection</h3>
              <p>
                Every certificate is cryptographically sealed. Any modification
                to the underlying evidence would invalidate the certificate hash.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CERTIFICATE PREVIEW */}
      <section className={styles.certificateSection} id="certificate-preview">
        <div className="container">
          <div className="section-header">
            <div className="section-label">Example Output</div>
            <h2>Verification Certificate</h2>
            <p>
              A real certificate generated from the academic misconduct evidence
              package.
            </p>
          </div>
          <div className={styles.certificatePreview}>
            <div className={styles.certHeader}>
              <div className={styles.certBrand}>
                <span
                  className="nav-logo-icon"
                  style={{ width: 24, height: 24, fontSize: 12 }}
                >
                  O
                </span>
                Source Verify Certificate
              </div>
              <div className={styles.certId}>OBJ-CERT-2025-04-28-7A3F</div>
            </div>
            <div className={styles.certBody}>
              <div className={styles.certTitle}>
                Independent Verification Certificate
              </div>
              <div className={styles.certSubtitle}>
                Issued: April 28, 2025 · 5 evidence items analyzed
              </div>

              <div className={styles.certScoreArea}>
                <ScoreRing score={87} label="confidence" />
              </div>

              <div className={styles.certDetails}>
                <div className={styles.certDetailItem}>
                  <div className={styles.certDetailLabel}>Classification</div>
                  <div className={styles.certDetailValue} style={{ color: "var(--success-light)" }}>
                    Highly Reliable
                  </div>
                </div>
                <div className={styles.certDetailItem}>
                  <div className={styles.certDetailLabel}>Evidence Type</div>
                  <div className={styles.certDetailValue}>
                    Multi-Source Package
                  </div>
                </div>
                <div className={styles.certDetailItem}>
                  <div className={styles.certDetailLabel}>Consistency</div>
                  <div className={styles.certDetailValue}>
                    92% Cross-Match
                  </div>
                </div>
                <div className={styles.certDetailItem}>
                  <div className={styles.certDetailLabel}>Corroboration</div>
                  <div className={styles.certDetailValue}>
                    Independent Witness
                  </div>
                </div>
              </div>

              <div className={styles.certEvidenceBreakdown}>
                <h4>Evidence Breakdown</h4>
                <div className={styles.certEvidenceRow}>
                  <span className={styles.certEvidenceName}>
                    Email Correspondence
                  </span>
                  <span
                    className={styles.certEvidenceScore}
                    style={{ color: "var(--success-light)" }}
                  >
                    91%
                  </span>
                </div>
                <div className={styles.certEvidenceRow}>
                  <span className={styles.certEvidenceName}>
                    Data Comparison Memo
                  </span>
                  <span
                    className={styles.certEvidenceScore}
                    style={{ color: "var(--success-light)" }}
                  >
                    94%
                  </span>
                </div>
                <div className={styles.certEvidenceRow}>
                  <span className={styles.certEvidenceName}>
                    Audio Recording
                  </span>
                  <span
                    className={styles.certEvidenceScore}
                    style={{ color: "var(--accent)" }}
                  >
                    78%
                  </span>
                </div>
                <div className={styles.certEvidenceRow}>
                  <span className={styles.certEvidenceName}>
                    Personal Notes
                  </span>
                  <span
                    className={styles.certEvidenceScore}
                    style={{ color: "var(--success-light)" }}
                  >
                    85%
                  </span>
                </div>
                <div className={styles.certEvidenceRow}>
                  <span className={styles.certEvidenceName}>
                    Journalist Intake
                  </span>
                  <span
                    className={styles.certEvidenceScore}
                    style={{ color: "var(--success-light)" }}
                  >
                    89%
                  </span>
                </div>
              </div>

              <div className={styles.certAttribution}>
                <h4>Publication-Ready Attribution</h4>
                <blockquote>
                  &quot;The internal review process was bypassed entirely,&quot;
                  said a source verified via Objection&apos;s independent
                  certification process (Certificate #OBJ-CERT-2025-04-28-7A3F,
                  confidence: 87%).
                </blockquote>
              </div>
            </div>
            <div className={styles.certFooter}>
              <div className={styles.certHash}>
                SHA-256: e3b0c44298fc1c149afbf4c8996fb924...
              </div>
              <div className={styles.certTimestamp}>
                2025-04-28T14:23:17Z
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className="container">
          <h2>Ready to verify?</h2>
          <p>
            Upload evidence and generate a verification certificate in minutes.
          </p>
          <Link href="/verify" className="btn btn-primary btn-lg">
            Start Verification
            <span>→</span>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
