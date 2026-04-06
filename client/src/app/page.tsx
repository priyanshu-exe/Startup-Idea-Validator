"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchIdeas, type IdeaSummary } from "@/lib/api";

export default function DashboardPage() {
  const [ideas, setIdeas] = useState<IdeaSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIdeas()
      .then(setIdeas)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="page-container">
        <div className="spinner-overlay">
          <div className="spinner" />
          <p>Loading ideas…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="page-header fade-in-up">
        <h1>Your Ideas</h1>
        <p>
          Browse your submitted startup ideas and explore AI-generated
          validation reports.
        </p>
      </div>

      {ideas.length === 0 ? (
        <div className="empty-state fade-in-up">
          <div className="empty-icon">💡</div>
          <h2>No ideas yet</h2>
          <p>Submit your first startup idea to get started.</p>
          <Link href="/submit" className="btn btn-primary" style={{ marginTop: 20 }}>
            + Submit Idea
          </Link>
        </div>
      ) : (
        <div className="ideas-grid">
          {ideas.map((idea, i) => (
            <Link
              href={`/idea/${idea._id}`}
              key={idea._id}
              className="card idea-card fade-in-up"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className="idea-title">{idea.title}</div>
              <div className="idea-desc">{idea.description}</div>
              <div className="idea-meta">
                <span
                  className={`status-chip status-${idea.status}`}
                >
                  <span className="status-dot" />
                  {idea.status}
                </span>
                {idea.analysis?.risk_level && (
                  <span
                    className={`badge badge-${idea.analysis.risk_level.toLowerCase()}`}
                  >
                    {idea.analysis.risk_level} Risk
                  </span>
                )}
                {idea.analysis?.profitability_score != null && (
                  <span className="badge badge-score">
                    🎯 {idea.analysis.profitability_score}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
