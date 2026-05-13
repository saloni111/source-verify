import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="nav-logo-icon" style={{ width: 22, height: 22, fontSize: 11 }}>O</span>
          Objection — Source Verify
        </div>
        <div className="footer-text">
          Prototype — Confidential
        </div>
      </div>
    </footer>
  );
}
