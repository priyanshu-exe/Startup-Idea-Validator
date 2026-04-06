"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchIdeaById, deleteIdea, type IdeaDetail } from "@/lib/api";

export default function IdeaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [idea, setIdea] = useState<IdeaDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchIdeaById(id)
      .then(setIdea)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this idea?")) return;
    try {
      await deleteIdea(id);
      router.push("/");
    } catch {
      alert("Failed to delete.");
    }
  };

  if (loading) {
    return (
      <main className="page-container">
        <div className="spinner-overlay">
          <div className="spinner" />
          <p>Loading report…</p>
        </div>
      </main>
    );
  }

  if (!idea) {
    return (
      <main className="page-container">
        <div className="empty-state">
          <div className="empty-icon">😕</div>
          <h2>Idea not found</h2>
        </div>
      </main>
    );
  }

  const a = idea.analysis;
  const riskClass = a.risk_level?.toLowerCase() || "medium";

  return (
    <main className="page-container">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="detail-header fade-in-up">
        <h1>{idea.title}</h1>
        <p className="detail-desc">{idea.description}</p>
        <div className="detail-meta">
          <span className={`status-chip status-${idea.status}`}>
            <span className="status-dot" />
            {idea.status}
          </span>
          <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
            {new Date(idea.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          <button
            className="btn btn-danger"
            style={{ padding: "6px 16px", fontSize: "0.78rem" }}
            onClick={handleDelete}
          >
            🗑 Delete
          </button>
        </div>
      </div>

      {idea.status !== "completed" ? (
        <div className="empty-state fade-in-up">
          <div className="empty-icon">⏳</div>
          <h2>
            {idea.status === "processing"
              ? "Analysis in progress…"
              : "Analysis failed"}
          </h2>
          <p>
            {idea.status === "processing"
              ? "The AI is still analyzing your idea. Refresh to check."
              : "Something went wrong during analysis. Try submitting again."}
          </p>
        </div>
      ) : (
        <>
          {/* ── Highlight Cards ──────────────────────────────── */}
          <div className="highlight-row fade-in-up">
            <div className="highlight-card">
              <div className="highlight-label">Profitability Score</div>
              <div className="highlight-value score">
                {a.profitability_score}
              </div>
            </div>
            <div className="highlight-card">
              <div className="highlight-label">Risk Level</div>
              <div
                className="highlight-value"
                style={{
                  color:
                    riskClass === "low"
                      ? "var(--green)"
                      : riskClass === "high"
                      ? "var(--red)"
                      : "var(--yellow)",
                }}
              >
                {a.risk_level}
              </div>
            </div>
          </div>

          {/* ── Report Grid ──────────────────────────────────── */}
          <div className="report-grid">
            <div className="report-section fade-in-up">
              <div className="section-label">🎯 Problem Summary</div>
              <div className="section-content">{a.problem}</div>
            </div>

            <div className="report-section fade-in-up">
              <div className="section-label">👤 Customer Persona</div>
              <div className="section-content">{a.customer}</div>
            </div>

            <div className="report-section fade-in-up">
              <div className="section-label">📊 Market Overview</div>
              <div className="section-content">{a.market}</div>
            </div>

            <div className="report-section fade-in-up">
              <div className="section-label">📝 Justification</div>
              <div className="section-content">{a.justification}</div>
            </div>

            <div className="report-section fade-in-up">
              <div className="section-label">⚔️ Top Competitors</div>
              <ul className="tag-list" style={{ flexDirection: "column" }}>
                {a.competitor?.map((c, i) => (
                  <li key={i} style={{ borderRadius: "var(--radius-sm)" }}>
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div className="report-section fade-in-up">
              <div className="section-label">🛠 Suggested Tech Stack</div>
              <ul className="tag-list">
                {a.tech_stack?.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
