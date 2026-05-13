import "./globals.css";

export const metadata = {
  title: "Objection — Source Verify",
  description:
    "Verify evidence from anonymous sources. Generate privacy-preserving certificates with publication-ready attribution language.",
  openGraph: {
    title: "Objection — Source Verify",
    description:
      "Independent verification for anonymous source evidence. Prove provenance. Protect identity.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0D0B09" />
      </head>
      <body>{children}</body>
    </html>
  );
}
