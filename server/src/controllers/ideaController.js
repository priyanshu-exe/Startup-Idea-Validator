const Idea = require("../models/Idea");
const { analyzeIdea } = require("../services/aiService");

// ── POST /ideas ────────────────────────────────────────────
exports.createIdea = async (req, res) => {
  try {
    const { title, description, model } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required." });
    }

    // Save the idea with "processing" status
    const idea = await Idea.create({ title, description, status: "processing" });

    // Trigger AI analysis (runs inline; keeps the flow simple for MVP)
    try {
      const analysis = await analyzeIdea(title, description, model);
      idea.analysis = analysis;
      idea.status = "completed";
    } catch (aiErr) {
      console.error("AI analysis failed:", aiErr.message);
      idea.status = "failed";
    }

    await idea.save();
    return res.status(201).json(idea);
  } catch (err) {
    console.error("createIdea error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// ── GET /ideas ─────────────────────────────────────────────
exports.getIdeas = async (_req, res) => {
  try {
    const ideas = await Idea.find()
      .sort({ createdAt: -1 })
      .select("title description status analysis.risk_level analysis.profitability_score createdAt");
    return res.json(ideas);
  } catch (err) {
    console.error("getIdeas error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// ── GET /ideas/:id ─────────────────────────────────────────
exports.getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ error: "Idea not found." });
    return res.json(idea);
  } catch (err) {
    console.error("getIdeaById error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// ── DELETE /ideas/:id ──────────────────────────────────────
exports.deleteIdea = async (req, res) => {
  try {
    const idea = await Idea.findByIdAndDelete(req.params.id);
    if (!idea) return res.status(404).json({ error: "Idea not found." });
    return res.json({ message: "Idea deleted successfully." });
  } catch (err) {
    console.error("deleteIdea error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};
