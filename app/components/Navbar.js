"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="nav" id="main-nav">
      <Link href="/" className="nav-logo">
        <span className="nav-logo-icon">O</span>
        <span>Source Verify</span>
      </Link>
      <ul className="nav-links">
        <li>
          <a href="#how-it-works">How It Works</a>
        </li>
        <li>
          <a href="#features">Features</a>
        </li>
        <li>
          <a href="#certificate-preview">Certificate</a>
        </li>
      </ul>
      <Link href="/verify" className="nav-cta">
        Verify Evidence
      </Link>
    </nav>
  );
}
