"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  SAMPLE_EVIDENCE,
  computeHash,
  runVerificationEngine,
  PROCESSING_STEPS,
  generateLogLines,
} from "../lib/engine";
import styles from "./verify.module.css";

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

function FileTypeBadge({ name }) {
  const ext = name.split(".").pop().toLowerCase();
  return <span className={styles.fileTypeBadge}>.{ext}</span>;
}

function ScoreRing({ score, size = 140, label }) {
  const radius = (size - 14) / 2;
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
        <span style={{ fontSize: "0.45em", color: "var(--cream-muted)", fontWeight: 400 }}>%</span>
        {label && <div className="score-ring-label">{label}</div>}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  const [files, setFiles] = useState([]);
  const [hashes, setHashes] = useState({});
  const [phase, setPhase] = useState("upload");
  const [currentStep, setCurrentStep] = useState(0);
  const [logLines, setLogLines] = useState([]);
  const [results, setResults] = useState(null);
  const [expandedEvidence, setExpandedEvidence] = useState({});
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logLines]);

  const loadSampleData = useCallback(async () => {
    setFiles(SAMPLE_EVIDENCE);
    const newHashes = {};
    for (const item of SAMPLE_EVIDENCE) {
      newHashes[item.id] = await computeHash(item.content + item.name);
    }
    setHashes(newHashes);
  }, []);

  const handleFiles = useCallback(
    async (fileList) => {
      const newFiles = [];
      const newHashes = { ...hashes };
      for (const file of fileList) {
        const id = `ev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        const text = file.type.startsWith("text") ? await file.text() : file.name;
        const hash = await computeHash(text + file.name);
        newHashes[id] = hash;
        newFiles.push({
          id,
          name: file.name,
          type: file.name.split(".").pop(),
          category: "Uploaded Evidence",
          size: file.size,
          content: text,
          entities: [],
          dates: [],
          claims: [],
        });
      }
      setFiles((prev) => [...prev, ...newFiles]);
      setHashes(newHashes);
    },
    [hashes]
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const removeFile = useCallback((id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const startVerification = useCallback(async () => {
    setPhase("processing");
    setCurrentStep(0);
    setLogLines([]);
    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      setCurrentStep(i);
      const logs = generateLogLines(i, files);
      for (let j = 0; j < logs.length; j++) {
        await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));
        setLogLines((prev) => [...prev, logs[j]]);
      }
      await new Promise((r) => setTimeout(r, PROCESSING_STEPS[i].duration));
    }
    const analysisResults = runVerificationEngine(files);
    analysisResults.hashes = hashes;
    setResults(analysisResults);
    setPhase("results");
    if (analysisResults.analyzedEvidence.length > 0) {
      setExpandedEvidence({ [analysisResults.analyzedEvidence[0].id]: true });
    }
  }, [files, hashes]);

  const copyAttribution = useCallback(async (text, index) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }, []);

  const toggleEvidence = useCallback((id) => {
    setExpandedEvidence((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const progress =
    phase === "processing"
      ? ((currentStep + 1) / PROCESSING_STEPS.length) * 100
      : phase === "results"
        ? 100
        : 0;

  return (
    <>
      <Navbar />
      <div className={styles.verifyPage}>
        <div className={styles.verifyHeader}>
          <div className="section-label">Evidence Verification Engine</div>
          <h1>Verify Evidence</h1>
          <p>
            Upload evidence files or load the sample evidence package to run
            the verification pipeline.
          </p>
        </div>

        {/* PHASE: Upload */}
        {phase === "upload" && (
          <div className={styles.uploadSection}>
            <div
              className={`${styles.uploadZone} ${dragOver ? styles.uploadZoneDragOver : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={styles.uploadIconArea}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <h3>Drop evidence files here</h3>
              <p>
                Supports text, PDF, documents, and audio. Files are hashed
                immediately upon upload.
              </p>
              <button
                className="btn btn-primary btn-sm"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              >
                Browse Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className={styles.uploadInput}
                onChange={(e) => handleFiles(e.target.files)}
              />
              <span className={styles.uploadOrText}>or</span>
              <button
                className={styles.loadSampleBtn}
                onClick={(e) => { e.stopPropagation(); loadSampleData(); }}
              >
                Load Sample Evidence Package
              </button>
            </div>

            {files.length > 0 && (
              <>
                <div className={styles.fileList}>
                  {files.map((file, i) => (
                    <div
                      key={file.id}
                      className={styles.fileItem}
                      style={{ animation: `fadeInUp 0.3s ease ${i * 0.05}s both` }}
                    >
                      <FileTypeBadge name={file.name} />
                      <div className={styles.fileInfo}>
                        <div className={styles.fileName}>{file.name}</div>
                        <div className={styles.fileMeta}>
                          <span>{formatBytes(file.size)}</span>
                          <span>{file.category}</span>
                        </div>
                        {hashes[file.id] && (
                          <div className={styles.fileHash}>
                            SHA-256: {hashes[file.id].substring(0, 24)}…
                          </div>
                        )}
                      </div>
                      <div className={styles.fileStatus}>
                        <span className="badge badge-success">Hashed</span>
                      </div>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeFile(file.id)}
                        aria-label="Remove file"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className={styles.actionBar}>
                  <div className={styles.fileCount}>
                    {files.length} evidence item{files.length !== 1 && "s"} staged
                  </div>
                  <button className="btn btn-primary" onClick={startVerification}>
                    Run Verification Engine
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* PHASE: Processing */}
        {phase === "processing" && (
          <div className={styles.processingSection}>
            <div className={styles.processingCard}>
              <div className={styles.processingHeader}>
                <div className={styles.processingSpinner}></div>
                <div className={styles.processingTitle}>
                  Analyzing {files.length} evidence items
                </div>
              </div>
              <div className={styles.processingSteps}>
                {PROCESSING_STEPS.map((step, i) => (
                  <div
                    key={i}
                    className={`${styles.processingStep} ${
                      i === currentStep ? styles.stepActive
                        : i < currentStep ? styles.stepComplete
                          : styles.stepPending
                    }`}
                  >
                    <div className={`${styles.stepIcon} ${
                      i === currentStep ? styles.stepIconActive
                        : i < currentStep ? styles.stepIconComplete
                          : styles.stepIconPending
                    }`}>
                      {i < currentStep ? "✓" : i + 1}
                    </div>
                    <div className={styles.stepContent}>
                      <div className={styles.stepName}>{step.name}</div>
                      <div className={styles.stepDesc}>{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className={styles.analysisLog} ref={logRef}>
              {logLines.map((line, i) => (
                <div
                  key={i}
                  className={`${styles.logLine} ${
                    line.includes("✓") || line.includes("VERIFIED") || line.includes("HIGH")
                      ? styles.logLineSuccess
                      : line.includes("[HASH]")
                        ? styles.logLineHighlight
                        : line.includes("[XREF]") || line.includes("[CERT]")
                          ? styles.logLineInfo
                          : ""
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PHASE: Results */}
        {phase === "results" && results && (
          <div className={styles.resultsSection}>
            <div className={styles.resultsHeader}>
              <div className="section-label">Verification Complete</div>
              <h2>Analysis Results</h2>
            </div>

            {/* Score + Metrics panel */}
            <div className={styles.scorePanel}>
              <div className={styles.scorePanelLeft}>
                <ScoreRing score={results.overallScore} size={136} label="confidence" />
                <span
                  className={`badge ${
                    results.overallScore >= 85 ? "badge-success"
                      : results.overallScore >= 70 ? "badge-warning"
                        : "badge-danger"
                  } ${styles.classificationBadge}`}
                >
                  {results.classification}
                </span>
              </div>
              <div className={styles.metricsGrid}>
                {[
                  { label: "Consistency", value: results.metrics.consistency, color: "var(--success-light)" },
                  { label: "Corroboration", value: results.metrics.corroboration, color: "var(--accent)" },
                  { label: "Temporal Coherence", value: results.metrics.temporalCoherence, color: "var(--info)" },
                  { label: "Provenance Strength", value: results.metrics.provenanceStrength, color: "var(--success-light)" },
                ].map((metric) => (
                  <div key={metric.label} className={styles.metricCard}>
                    <div className={styles.metricLabel}>{metric.label}</div>
                    <div className={styles.metricValue} style={{ color: metric.color }}>
                      {metric.value}
                      <span className={styles.metricUnit}>%</span>
                    </div>
                    <div className={styles.metricTrack}>
                      <div
                        className={styles.metricFill}
                        style={{ width: `${metric.value}%`, background: metric.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence breakdown */}
            <div className={styles.evidenceSection}>
              <div className={styles.sectionTitle}>Evidence Breakdown</div>
              {results.analyzedEvidence.map((item) => (
                <div key={item.id} className={styles.evidenceItem}>
                  <div
                    className={styles.evidenceItemHeader}
                    onClick={() => toggleEvidence(item.id)}
                  >
                    <div className={styles.evidenceItemLeft}>
                      <FileTypeBadge name={item.name} />
                      <div>
                        <div className={styles.evidenceItemName}>{item.name}</div>
                        <div className={styles.evidenceItemCategory}>{item.category}</div>
                      </div>
                    </div>
                    <div className={styles.evidenceItemRight}>
                      <span
                        className={styles.evidenceScore}
                        style={{
                          color: item.score >= 85 ? "var(--success-light)"
                            : item.score >= 70 ? "var(--accent)"
                              : "var(--danger)",
                        }}
                      >
                        {item.score}%
                      </span>
                      <span className={`${styles.chevron} ${expandedEvidence[item.id] ? styles.chevronOpen : ""}`}>›</span>
                    </div>
                  </div>
                  {expandedEvidence[item.id] && (
                    <div className={styles.evidenceItemBody}>
                      <ul className={styles.findingsList}>
                        {item.findings.map((finding, i) => (
                          <li key={i} className={styles.findingItem}>
                            <span className={`${styles.findingDot} ${
                              finding.type === "corroborates" ? styles.dotSuccess
                                : finding.type === "warning" ? styles.dotWarning
                                  : styles.dotInfo
                            }`} />
                            <span>{finding.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Attribution */}
            <div className={styles.attributionSection}>
              <div className={styles.sectionTitle}>Attribution Language</div>
              <div className={styles.attributionList}>
                {results.attributions.map((attr, i) => (
                  <div key={i} className={styles.attributionItem}>
                    <div className={styles.attributionMeta}>
                      <span className={styles.attributionLabel}>{attr.label}</span>
                      <button
                        className={`${styles.copyBtn} ${copiedIndex === i ? styles.copiedBtn : ""}`}
                        onClick={() => copyAttribution(attr.text, i)}
                      >
                        {copiedIndex === i ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <div className={styles.attributionText}>{attr.text}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className={styles.certActions}>
              <Link
                href={`/certificate?id=${encodeURIComponent(results.certId)}&score=${results.overallScore}&classification=${encodeURIComponent(results.classification)}&count=${results.evidenceCount}&timestamp=${encodeURIComponent(results.timestamp)}`}
                className="btn btn-primary"
              >
                View Full Certificate
              </Link>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setPhase("upload");
                  setFiles([]);
                  setResults(null);
                  setLogLines([]);
                  setHashes({});
                }}
              >
                New Verification
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
