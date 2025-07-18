# 🤖 AI-Based Collaborative Code Review Platform

![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-Active-blue)
![Contributions](https://img.shields.io/badge/contributions-welcome-brightgreen)

AI-Powered Code Review Platform for seamless collaborative programming. It allows real-time code editing, AI suggestions, code feedback, and developer-to-developer interaction in one place.

---

## 🔥 Features

- 🧠 **AI-Powered Code Review** – Get instant code suggestions using Gemini AI.
- 👥 **Live Collaboration** – Real-time multi-user code editing.
- 💬 **Review Panel** – View AI feedback and improvements.
- 🔒 **Secure Backend** – RESTful APIs with environment variable protection.
- ⚡ **Socket.io Integration** – Real-time sync for code across sessions.
- 🌐 **Responsive Design** – Fully responsive for desktop, tablet, and mobile.
- 🧩 **Customizable Editor** – Powered by `react-simple-code-editor` and `PrismJS`.

---

## 🛠️ Tech Stack

| Frontend        | Backend           | Others                  |
|----------------|-------------------|--------------------------|
| React.js        | Node.js           | OpenAI/Gemini API        |
| TailwindCSS     | Express.js        | Socket.io                |
| Prism.js        | Vite              | dotenv, axios            |
| React Simple Code Editor |         |                          |

---

## 📸 Screenshots

| Collaboration Panel | Code Review Panel |
|---------------------|-------------------|
| ![Collaborate](./screenshots/collaboration.png) | ![Review](./screenshots/review.png) |

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js ≥ 18
- OpenAI / Gemini API Key

### 📦 Installation

```bash
git clone https://github.com/your-username/ai-collab-review.git
cd ai-collab-review
📁 Setup
Install dependencies:

bash
Copy
Edit
npm install
Create a .env file and add your environment variables:

ini
Copy
Edit
VITE_API_BASE_URL=http://localhost:5000
VITE_OPENAI_API_KEY=your_api_key
Start frontend and backend:

bash
Copy
Edit
# Start backend
cd server
npm install
npm run dev

# Start frontend
cd ..
npm run dev
📂 Folder Structure
pgsql
Copy
Edit
├── client
│   ├── components
│   ├── hooks
│   ├── App.jsx
│   ├── main.jsx
├── server
│   ├── routes
│   ├── controllers
│   ├── index.js
├── .env
├── README.md
🧠 How It Works
User enters code.

AI reviews the code using the chosen LLM API (OpenAI/Gemini).

Real-time collaboration is enabled via WebSockets.

Feedback is shown in a separate review panel.

Developers can chat, modify, and improve code together.

🛡️ Security
API keys stored securely using .env.

CORS and input sanitization implemented.

Socket communication is namespace scoped.









Live -> https://code-collab-ai.vercel.app/
