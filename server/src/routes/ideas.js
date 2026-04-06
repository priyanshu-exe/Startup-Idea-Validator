const express = require("express");
const router = express.Router();
const {
  createIdea,
  getIdeas,
  getIdeaById,
  deleteIdea,
} = require("../controllers/ideaController");
const { AVAILABLE_MODELS } = require("../services/aiService");

// Model list endpoint
router.get("/models", (_req, res) => res.json(AVAILABLE_MODELS));

router.post("/", createIdea);
router.get("/", getIdeas);
router.get("/:id", getIdeaById);
router.delete("/:id", deleteIdea);

module.exports = router;
