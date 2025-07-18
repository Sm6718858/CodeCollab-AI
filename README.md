# 🤖 AI-Based Collaborative(one to one) Code Review Platform

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

| Frontend                | Backend     | Others               |
|-------------------------|-------------|-----------------------|
| React.js                | Node.js     | OpenAI/Gemini API     |
| TailwindCSS             | Express.js  | Socket.io             |
| Prism.js                | Vite        | dotenv, axios         |
| React Simple Code Editor|             |                       |

---

## 📸 Screenshots

| Collaboration Panel | Code Review Panel |
|---------------------|-------------------|
| ![Collaborate](https://github.com/user-attachments/assets/ef279da1-14aa-490e-a52e-9a2d3a2bd679) | ![Review](https://github.com/user-attachments/assets/26a25f8d-545e-4218-a5bc-4fdb096e3ce4) |

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js ≥ 18  
- Gemini API Key

### 📦 Installation

```bash
git clone https://github.com/Sm6718858/CodeCollab-AI.git
cd CodeCollab-AI
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
VITE_API_BASE_URL=http://localhost:3000
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
bash
Copy
Edit
├── FrontEnd
│   ├── components
│   ├── hooks
│   ├── utils
│   ├── App.jsx
│   ├── main.jsx
├── BackEnd
│   ├── routes
│   ├── controllers
│   ├── services
│   ├── sockets
│   ├── server.js
├── .env
├── README.md
🧠 How It Works
User enters code.

Live Project 👉 code-collab-ai.vercel.app

AI reviews the code using the chosen LLM API (Gemini).

Real-time collaboration is enabled via WebSockets.

Feedback is shown in a separate review panel.

Developers can chat, modify, and improve code together.

If user starts prompt with @ → AI replies in a FRIENDLY MANNER.

🛡️ Security
API keys stored securely using .env.

CORS and input sanitization implemented.

Socket communication is namespace scoped.

🤝 Contributions
Pull requests are welcome! 🙌

📫 Contact
Developer: Shivam Mishra
LinkedIn: shivam134
Email: sm6718858@gmail.com
