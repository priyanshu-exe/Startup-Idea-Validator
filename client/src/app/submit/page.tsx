"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { submitIdea, fetchModels, type AIModel } from "@/lib/api";

export default function SubmitPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [model, setModel] = useState("");
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchModels()
      .then((m) => {
        setModels(m);
        if (m.length > 0) setModel(m[0].id);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Both fields are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const idea = await submitIdea(title, description, model);
      router.push(`/idea/${idea._id}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="page-container">
      <div className="page-header fade-in-up" style={{ textAlign: "center" }}>
        <h1>Submit Your Idea</h1>
        <p style={{ margin: "0 auto" }}>
          Describe your startup concept and let our AI analyze its potential.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="submit-card fade-in-up">
        <div className="form-group">
          <label htmlFor="title">Idea Title</label>
          <input
            id="title"
            type="text"
            placeholder="e.g. AI-Powered Grocery Planner"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Describe the problem you're solving, the target audience, and how your product works…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="model">AI Model</label>
          <div className="model-selector">
            {models.map((m) => (
              <button
                type="button"
                key={m.id}
                className={`model-option ${model === m.id ? "model-active" : ""}`}
                onClick={() => setModel(m.id)}
                disabled={loading}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p style={{ color: "var(--red)", marginBottom: 16, fontSize: "0.85rem" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ width: "100%" }}
        >
          {loading ? (
            <>
              <span
                className="spinner"
                style={{ width: 18, height: 18, borderWidth: 2 }}
              />
              Analyzing with AI…
            </>
          ) : (
            "🚀 Validate Idea"
          )}
        </button>
      </form>
    </main>
  );
}
