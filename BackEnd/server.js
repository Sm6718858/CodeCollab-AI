require('dotenv').config(); 

const app = require('./src/app');
const http = require('http');
const { Server } = require('socket.io');
const registerPairProgrammingSocket = require('./src/sockets/pairProgramming.socket');

const PORT = process.env.PORT || 3000; 

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST']
  }
});


io.on('connection', (socket) => {
  console.log(' User connected:', socket.id);
  registerPairProgrammingSocket(io, socket);
});


server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
