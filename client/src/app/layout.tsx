import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "IdeaLab — AI Startup Idea Validator",
  description:
    "Submit your startup idea and get an AI-powered validation report with market analysis, risk assessment, and profitability scoring.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <Link href="/" className="navbar-logo">
            <span className="logo-icon">🧪</span>
            <span>IdeaLab</span>
          </Link>
          <div className="navbar-links">
            <Link href="/">Dashboard</Link>
            <Link href="/submit" className="btn-primary">
              + New Idea
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
