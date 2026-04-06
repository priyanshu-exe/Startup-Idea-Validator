# IdeaLab — AI-Powered Startup Idea Validator

An MVP web application that lets users submit startup ideas and receive an AI-generated validation report including market analysis, competitor landscape, risk assessment, and profitability scoring.

---

## 📁 Project Structure

```
Startup-Idea-Validator/
├── client/            # Next.js (React) frontend
│   └── src/
│       ├── app/
│       │   ├── globals.css          # Global design system
│       │   ├── layout.tsx           # Root layout + navbar
│       │   ├── page.tsx             # Dashboard (list ideas)
│       │   ├── submit/page.tsx      # Submit new idea form
│       │   └── idea/[id]/page.tsx   # Detailed AI report view
│       └── lib/
│           └── api.ts               # API helper functions
│
└── server/            # Express.js backend
    └── src/
        ├── index.js                 # Entry point + MongoDB connection
        ├── models/Idea.js           # Mongoose schema
        ├── services/aiService.js    # Groq integration
        ├── controllers/ideaController.js  # Business logic
        └── routes/ideas.js          # REST routes
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (or local MongoDB)
- GROQ API key

### 1. Clone the repository
```bash
git clone https://github.com/priyanshu-exe/Startup-Idea-Validator.git
cd Startup-Idea-Validator
```

### 2. Start the Backend
```bash
cd server
cp .env.example .env       # Then fill in your credentials
npm install
npm run dev
```

### 3. Start the Frontend
```bash
cd client
npm install
npm run dev
```

The frontend runs on **http://localhost:3000** and the backend on **http://localhost:5000**.

---

## 🔌 API Endpoints

| Method   | Endpoint      | Description                        |
|----------|---------------|------------------------------------|
| `POST`   | `/ideas`      | Submit idea + trigger AI analysis  |
| `GET`    | `/ideas`      | List all saved ideas               |
| `GET`    | `/ideas/:id`  | Get full analysis report           |
| `DELETE` | `/ideas/:id`  | Delete an idea                     |

---

## 🤖 AI Prompt Used

```
You are an expert startup consultant. Analyze the given startup idea
and return a structured JSON object with the fields: problem,
customer, market, competitor, tech_stack, risk_level,
profitability_score, justification.

Rules:
- Keep answers concise and realistic.
- "competitor" should contain exactly 3 competitors with one-line differentiation each.
- "tech_stack" should be 4–6 practical technologies for MVP.
- "profitability_score" must be an integer between 0–100.
- "risk_level" must be one of: "Low", "Medium", "High".

Return ONLY valid JSON.

Input: { "title": "...", "description": "..." }
```

---

## 🛠 Tech Stack

| Layer      | Technology                      |
|------------|---------------------------------|
| Frontend   | Next.js 15 (App Router), Vanilla CSS |
| Backend    | Express.js, Node.js             |
| Database   | MongoDB (Mongoose)              |
| AI         | Groq                            |

---

## ☁️ Deployment (Recommended)

| Component  | Platform          |
|------------|-------------------|
| Frontend   | Vercel / Netlify  |
| Backend    | Render / Railway  |
| Database   | MongoDB Atlas     |

---

## 📄 Environment Variables

### Server (`server/.env`)
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/startup-validator
GROQ_API_KEY=...
```

### Client (`client/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---