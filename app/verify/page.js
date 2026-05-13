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

// File type icons
const FILE_ICONS = {
  text: "📄",
  pdf: "📑",
  audio: "🎙️",
  document: "📋",
  image: "🖼️",
  video: "🎬",
  default: "📎",
};

function getFileIcon(name) {
  const ext = name.split(".").pop().toLowerCase();
  if (["txt", "md", "csv"].includes(ext)) return FILE_ICONS.text;
  if (ext === "pdf") return FILE_ICONS.pdf;
  if (["mp3", "wav", "ogg", "m4a"].includes(ext)) return FILE_ICONS.audio;
  if (["doc", "docx", "rtf"].includes(ext)) return FILE_ICONS.document;
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return FILE_ICONS.image;
  if (["mp4", "mov", "avi"].includes(ext)) return FILE_ICONS.video;
  return FILE_ICONS.default;
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

// Score ring component
function ScoreRing({ score, size = 140, label }) {
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

export default function VerifyPage() {
  const [files, setFiles] = useState([]);
  const [hashes, setHashes] = useState({});
  const [phase, setPhase] = useState("upload"); // upload | processing | results
  const [currentStep, setCurrentStep] = useState(0);
  const [logLines, setLogLines] = useState([]);
  const [results, setResults] = useState(null);
  const [expandedEvidence, setExpandedEvidence] = useState({});
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const logRef = useRef(null);

  // Auto-scroll log
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logLines]);

  // Load sample evidence
  const loadSampleData = useCallback(async () => {
    setFiles(SAMPLE_EVIDENCE);

    // Compute hashes for sample data
    const newHashes = {};
    for (const item of SAMPLE_EVIDENCE) {
      newHashes[item.id] = await computeHash(item.content + item.name);
    }
    setHashes(newHashes);
  }, []);

  // Handle file upload
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

  // Run verification pipeline
  const startVerification = useCallback(async () => {
    setPhase("processing");
    setCurrentStep(0);
    setLogLines([]);

    // Simulate processing steps
    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      setCurrentStep(i);

      const logs = generateLogLines(i, files);
      for (let j = 0; j < logs.length; j++) {
        await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));
        setLogLines((prev) => [...prev, logs[j]]);
      }

      await new Promise((r) => setTimeout(r, PROCESSING_STEPS[i].duration));
    }

    // Run actual analysis
    const analysisResults = runVerificationEngine(files);
    analysisResults.hashes = hashes;

    setResults(analysisResults);
    setPhase("results");

    // Expand first evidence item by default
    if (analysisResults.analyzedEvidence.length > 0) {
      setExpandedEvidence({ [analysisResults.analyzedEvidence[0].id]: true });
    }
  }, [files, hashes]);

  // Copy attribution
  const copyAttribution = useCallback(async (text, index) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }, []);

  // Toggle evidence expansion
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
        {/* Header */}
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
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={styles.uploadIcon}>📂</div>
              <h3>Drop evidence files here</h3>
              <p>
                Supports text, PDF, documents, audio, and images. All files are
                hashed immediately upon upload.
              </p>
              <button
                className="btn btn-primary btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
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
              <span className={styles.uploadOrText}>— or —</span>
              <button
                className={styles.loadSampleBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  loadSampleData();
                }}
              >
                ⚡ Load Sample Evidence Package
              </button>
            </div>

            {/* File list */}
            {files.length > 0 && (
              <>
                <div className={styles.fileList}>
                  {files.map((file, i) => (
                    <div
                      key={file.id}
                      className={styles.fileItem}
                      style={{ animation: `fadeInUp 0.3s ease ${i * 0.05}s both` }}
                    >
                      <div className={styles.fileIcon}>
                        {getFileIcon(file.name)}
                      </div>
                      <div className={styles.fileInfo}>
                        <div className={styles.fileName}>{file.name}</div>
                        <div className={styles.fileMeta}>
                          <span>{formatBytes(file.size)}</span>
                          <span>{file.category}</span>
                        </div>
                        {hashes[file.id] && (
                          <div className={styles.fileHash}>
                            SHA-256: {hashes[file.id].substring(0, 24)}...
                          </div>
                        )}
                      </div>
                      <div className={styles.fileStatus}>
                        <span className="badge badge-success">✓ Hashed</span>
                      </div>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeFile(file.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className={styles.actionBar}>
                  <div className={styles.fileCount}>
                    {files.length} evidence item{files.length !== 1 && "s"} loaded
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={startVerification}
                  >
                    Run Verification Engine →
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
                  Analyzing {files.length} evidence items...
                </div>
              </div>

              <div className={styles.processingSteps}>
                {PROCESSING_STEPS.map((step, i) => (
                  <div
                    key={i}
                    className={`${styles.processingStep} ${
                      i === currentStep
                        ? styles.stepActive
                        : i < currentStep
                          ? styles.stepComplete
                          : styles.stepPending
                    }`}
                  >
                    <div
                      className={`${styles.stepIcon} ${
                        i === currentStep
                          ? styles.stepIconActive
                          : i < currentStep
                            ? styles.stepIconComplete
                            : styles.stepIconPending
                      }`}
                    >
                      {i < currentStep ? "✓" : i === currentStep ? "⟳" : (i + 1)}
                    </div>
                    <div className={styles.stepContent}>
                      <div className={styles.stepName}>{step.name}</div>
                      <div className={styles.stepDesc}>{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Live log */}
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

            {/* Overview */}
            <div className={styles.overviewGrid}>
              <div className={styles.scoreColumn}>
                <ScoreRing score={results.overallScore} label="confidence" />
                <span
                  className={`badge ${
                    results.overallScore >= 85
                      ? "badge-success"
                      : results.overallScore >= 70
                        ? "badge-warning"
                        : "badge-danger"
                  } ${styles.classificationBadge}`}
                >
                  {results.classification}
                </span>
              </div>

              <div className={styles.metricsColumn}>
                {[
                  {
                    label: "Consistency",
                    value: results.metrics.consistency,
                    color: "var(--success-light)",
                  },
                  {
                    label: "Corroboration",
                    value: results.metrics.corroboration,
                    color: "var(--accent)",
                  },
                  {
                    label: "Temporal Coherence",
                    value: results.metrics.temporalCoherence,
                    color: "var(--info)",
                  },
                  {
                    label: "Provenance Strength",
                    value: results.metrics.provenanceStrength,
                    color: "var(--success-light)",
                  },
                ].map((metric) => (
                  <div key={metric.label} className={styles.metricCard}>
                    <div className={styles.metricLabel}>{metric.label}</div>
                    <div className={styles.metricValue} style={{ color: metric.color }}>
                      {metric.value}%
                    </div>
                    <div className={styles.metricBar}>
                      <div
                        className={styles.metricBarFill}
                        style={{
                          width: `${metric.value}%`,
                          background: metric.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence breakdown */}
            <div className={styles.evidenceAnalysis}>
              <h3>
                📊 Evidence Breakdown
              </h3>
              {results.analyzedEvidence.map((item) => (
                <div key={item.id} className={styles.evidenceItemResult}>
                  <div
                    className={styles.evidenceItemHeader}
                    onClick={() => toggleEvidence(item.id)}
                  >
                    <div className={styles.evidenceItemLeft}>
                      <span>{getFileIcon(item.name)}</span>
                      <div>
                        <div className={styles.evidenceItemName}>
                          {item.name}
                        </div>
                        <div className={styles.evidenceItemType}>
                          {item.category}
                        </div>
                      </div>
                    </div>
                    <div
                      className={styles.evidenceItemScore}
                      style={{
                        color:
                          item.score >= 85
                            ? "var(--success-light)"
                            : item.score >= 70
                              ? "var(--accent)"
                              : "var(--danger)",
                      }}
                    >
                      {item.score}%
                    </div>
                  </div>
                  {expandedEvidence[item.id] && (
                    <div className={styles.evidenceItemBody}>
                      <ul className={styles.findingsList}>
                        {item.findings.map((finding, i) => (
                          <li key={i} className={styles.findingItem}>
                            <span
                              className={`${styles.findingIcon} ${
                                finding.type === "corroborates"
                                  ? styles.findingCorroborates
                                  : finding.type === "warning"
                                    ? styles.findingWarning
                                    : styles.findingNote
                              }`}
                            >
                              {finding.type === "corroborates"
                                ? "✓"
                                : finding.type === "warning"
                                  ? "⚠"
                                  : "ℹ"}
                            </span>
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
              <h3>✍️ Publication-Ready Attribution</h3>
              <div className={styles.attributionOptions}>
                {results.attributions.map((attr, i) => (
                  <div key={i} className={styles.attributionOption}>
                    <div className={styles.attributionLabel}>{attr.label}</div>
                    <div className={styles.attributionText}>{attr.text}</div>
                    <button
                      className={`${styles.copyBtn} ${copiedIndex === i ? styles.copiedBtn : ""}`}
                      onClick={() => copyAttribution(attr.text, i)}
                    >
                      {copiedIndex === i ? "✓ Copied" : "📋 Copy to Clipboard"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificate actions */}
            <div className={styles.certActions}>
              <Link
                href={`/certificate?id=${encodeURIComponent(results.certId)}&score=${results.overallScore}&classification=${encodeURIComponent(results.classification)}&count=${results.evidenceCount}&timestamp=${encodeURIComponent(results.timestamp)}`}
                className="btn btn-primary"
              >
                View Full Certificate →
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
