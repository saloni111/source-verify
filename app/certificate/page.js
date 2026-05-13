"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./certificate.module.css";

const EVIDENCE_ITEMS = [
  { name: "Email Correspondence", ext: "pdf", score: 91 },
  { name: "Data Comparison Memo", ext: "docx", score: 94 },
  { name: "Audio Recording", ext: "mp3", score: 78 },
  { name: "Personal Notes", ext: "docx", score: 85 },
  { name: "Journalist Intake", ext: "txt", score: 89 },
];

function ScoreRing({ score, size = 160, label }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 85
      ? "var(--success-light)"
      : score >= 70
        ? "var(--accent)"
        : score >= 50
          ? "var(--warning)"
          : "var(--danger)";

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
          style={{ stroke: color }}
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

function CertificateContent() {
  const params = useSearchParams();

  const certId = params.get("id") || "OBJ-CERT-2025-04-28-7A3F";
  const score = parseInt(params.get("score") || "87", 10);
  const classification = params.get("classification") || "Highly Reliable";
  const count = parseInt(params.get("count") || "5", 10);
  const timestamp =
    params.get("timestamp") || new Date().toISOString();

  const displayDate = new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const displayTime = new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });

  // Derive a deterministic certificate hash from the cert ID + timestamp
  const certHash = Array.from(certId + timestamp)
    .reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0)
    .toString(16)
    .replace("-", "");
  const fullHash = `${certHash}a4f8c2e1b9d73056f1e2a8c4d5b6e7f0${certHash}d9a1c3b5e7f20846`.slice(0, 64);

  return (
    <>
      <Navbar />
      <div className={styles.certPage}>
        <div className={styles.certContainer}>
          <div className={styles.certDocument}>
            {/* Decorative bar */}
            <div className={styles.certDocBar}></div>

            {/* Header */}
            <div className={styles.certDocHeader}>
              <div className={styles.certDocBrand}>
                <span
                  className="nav-logo-icon"
                  style={{ width: 28, height: 28, fontSize: 14 }}
                >
                  O
                </span>
                Source Verify
              </div>
              <div className={styles.certDocMeta}>
                <div className={styles.certDocId}>{certId}</div>
                <div className={styles.certDocDate}>{displayDate}</div>
              </div>
            </div>

            {/* Body */}
            <div className={styles.certDocBody}>
              <h1 className={styles.certDocTitle}>
                Independent Verification Certificate
              </h1>
              <p className={styles.certDocSubtitle}>
                Issued {displayDate} · {count} evidence items analyzed
              </p>

              {/* Score */}
              <div className={styles.certDocScoreArea}>
                <ScoreRing score={score} size={160} label="confidence" />
              </div>

              {/* Details grid */}
              <div className={styles.certDocGrid}>
                <div className={styles.certDocGridItem}>
                  <div className={styles.certDocGridLabel}>Classification</div>
                  <div
                    className={styles.certDocGridValue}
                    style={{
                      color:
                        score >= 85
                          ? "var(--success-light)"
                          : score >= 70
                            ? "var(--accent)"
                            : "var(--danger)",
                    }}
                  >
                    {classification}
                  </div>
                </div>
                <div className={styles.certDocGridItem}>
                  <div className={styles.certDocGridLabel}>Evidence Count</div>
                  <div className={styles.certDocGridValue}>
                    {count} Items
                  </div>
                </div>
                <div className={styles.certDocGridItem}>
                  <div className={styles.certDocGridLabel}>Evidence Type</div>
                  <div className={styles.certDocGridValue}>
                    Multi-Source Package
                  </div>
                </div>
                <div className={styles.certDocGridItem}>
                  <div className={styles.certDocGridLabel}>
                    Corroboration
                  </div>
                  <div className={styles.certDocGridValue}>
                    Independent Witness
                  </div>
                </div>
              </div>

              <div className={styles.certDocDivider}></div>

              {/* Evidence breakdown */}
              <div className={styles.certDocSectionLabel}>
                Evidence Breakdown
              </div>
              <div className={styles.certDocEvidenceList}>
                {EVIDENCE_ITEMS.map((item, i) => (
                  <div key={i} className={styles.certDocEvidenceRow}>
                    <span className={styles.certDocEvidenceName}>
                      <span className={styles.certDocEvidenceExt}>.{item.ext}</span>
                      {item.name}
                    </span>
                    <span
                      className={styles.certDocEvidenceScore}
                      style={{
                        color:
                          item.score >= 85
                            ? "var(--success-light)"
                            : item.score >= 70
                              ? "var(--accent)"
                              : "var(--warning)",
                      }}
                    >
                      {item.score}%
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.certDocDivider}></div>

              {/* Attribution */}
              <div className={styles.certDocSectionLabel}>
                Publication-Ready Attribution
              </div>
              <div className={styles.certDocAttribution}>
                <div className={styles.certDocAttrLabel}>
                  Recommended Attribution
                </div>
                <div className={styles.certDocAttrText}>
                  &quot;The internal review process was bypassed entirely,&quot;
                  said a source verified via Objection&apos;s independent
                  certification process (Certificate #{certId}, confidence:{" "}
                  {score}%).
                </div>
              </div>

              <div className={styles.certDocAttribution}>
                <div className={styles.certDocAttrLabel}>
                  Background Attribution
                </div>
                <div className={styles.certDocAttrText}>
                  The allegations are supported by {count} pieces of
                  independently verified evidence, including primary
                  communications, quantitative analysis, and witness
                  corroboration, as certified by Objection ({certId}).
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={styles.certDocFooter}>
              <div className={styles.certDocHash}>
                SHA-256: {fullHash}
              </div>
              <div className={styles.certDocSeal}>
                <span className={styles.certDocSealIcon}>✓</span>
                VERIFIED · {displayTime}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.certPageActions}>
            <button
              className="btn btn-primary"
              onClick={() => window.print()}
            >
              Print Certificate
            </button>
            <Link href="/verify" className="btn btn-secondary">
              New Verification
            </Link>
            <Link href="/" className="btn btn-ghost">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function CertificatePage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="processingSpinner" style={{ width: 40, height: 40 }}></div>
        </div>
      }
    >
      <CertificateContent />
    </Suspense>
  );
}
