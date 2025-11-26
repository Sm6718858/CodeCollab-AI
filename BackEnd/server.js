require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require("mongoose");
const registerPairProgrammingSocket = require('./src/sockets/pairProgramming.socket');
const app = require('./src/app');
const User = require("./src/Model/User.js"); 

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

app.use(require("express").json());

app.post("/auth/sync-user", async (req, res) => {
  try {
    const { clerkId, email, name, image } = req.body;

    if (!clerkId || !email) {
      return res.status(400).json({ message: "clerkId and email are required" });
    }

    const user = await User.findOneAndUpdate(
      { clerkId },
      { email, name, image },
      { upsert: true, new: true }
    );

    // console.log("User synced:", user.email);
    res.json({ success: true, user });
  } catch (err) {
    console.error("Sync user error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ================= SOCKET.IO =================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

io.on('connection', (socket) => {
  console.log(' User connected:', socket.id);
  registerPairProgrammingSocket(io, socket);
});

server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
