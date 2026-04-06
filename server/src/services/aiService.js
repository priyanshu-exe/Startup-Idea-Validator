const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Models available for the user to choose from
const AVAILABLE_MODELS = [
  { id: "llama-3.3-70b-versatile", name: "LLaMA 3.3 70B" },
  { id: "llama-3.1-8b-instant", name: "LLaMA 3.1 8B (Fast)" },
  { id: "llama-3.1-70b-versatile", name: "LLaMA 3.1 70B" },
  { id: "gemma2-9b-it", name: "Gemma 2 9B" },
];

const DEFAULT_MODEL = "llama-3.3-70b-versatile";

/**
 * Sends the startup idea to Groq and returns structured JSON analysis.
 * @param {string} title
 * @param {string} description
 * @param {string} [model] - Groq model id to use
 * @returns {Promise<object>} Parsed analysis object
 */
async function analyzeIdea(title, description, model) {
  const selectedModel = model || DEFAULT_MODEL;

  const systemPrompt = `You are an expert startup consultant. Analyze the given startup idea and return a structured JSON object with the fields: problem, customer, market, competitor, tech_stack, risk_level, profitability_score, justification.
Rules:
- Keep answers concise and realistic.
- "problem" should be a concise summary of the core problem the startup solves.
- "customer" should describe the primary customer persona in 2-3 sentences.
- "market" should give a brief market overview including size and trends.
- "competitor" should contain exactly 3 competitors, each as a string with the competitor name followed by a one-line differentiation (e.g. "CompetitorName - differentiator").
- "tech_stack" should be 4–6 practical technologies for MVP.
- "risk_level" must be one of: "Low", "Medium", "High".
- "profitability_score" must be an integer between 0–100.
- "justification" should explain the risk level and profitability score in 2-3 sentences.
Return ONLY valid JSON. No markdown, no code fences, no commentary.`;

  const userPrompt = JSON.stringify({ title, description });

  const response = await groq.chat.completions.create({
    model: selectedModel,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 1024,
  });

  const raw = response.choices[0].message.content.trim();

  // Robust JSON extraction: strip code fences, then find first { ... } block
  let cleaned = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "");

  // If the response still has extra text, extract the JSON object
  const startIdx = cleaned.indexOf("{");
  const endIdx = cleaned.lastIndexOf("}");
  if (startIdx !== -1 && endIdx !== -1) {
    cleaned = cleaned.slice(startIdx, endIdx + 1);
  }

  return JSON.parse(cleaned);
}

module.exports = { analyzeIdea, AVAILABLE_MODELS };
