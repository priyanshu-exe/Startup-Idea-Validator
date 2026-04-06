const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface AIModel {
  id: string;
  name: string;
}

export interface IdeaSummary {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "processing" | "completed" | "failed";
  analysis?: {
    risk_level?: string;
    profitability_score?: number;
  };
  createdAt: string;
}

export interface IdeaDetail extends IdeaSummary {
  analysis: {
    problem: string;
    customer: string;
    market: string;
    competitor: string[];
    tech_stack: string[];
    risk_level: string;
    profitability_score: number;
    justification: string;
  };
}

export async function fetchIdeas(): Promise<IdeaSummary[]> {
  const res = await fetch(`${API_BASE}/ideas`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch ideas");
  return res.json();
}

export async function fetchIdeaById(id: string): Promise<IdeaDetail> {
  const res = await fetch(`${API_BASE}/ideas/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch idea");
  return res.json();
}

export async function fetchModels(): Promise<AIModel[]> {
  const res = await fetch(`${API_BASE}/ideas/models`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch models");
  return res.json();
}

export async function submitIdea(
  title: string,
  description: string,
  model?: string
): Promise<IdeaDetail> {
  const res = await fetch(`${API_BASE}/ideas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, model }),
  });
  if (!res.ok) throw new Error("Failed to submit idea");
  return res.json();
}

export async function deleteIdea(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/ideas/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete idea");
}
