const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },

    // ── AI‑generated analysis fields ───────────────────────
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    analysis: {
      problem: { type: String, default: "" },
      customer: { type: String, default: "" },
      market: { type: String, default: "" },
      competitor: { type: [String], default: [] },
      tech_stack: { type: [String], default: [] },
      risk_level: {
        type: String,
        enum: ["Low", "Medium", "High", ""],
        default: "",
      },
      profitability_score: { type: Number, default: 0 },
      justification: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Idea", ideaSchema);
