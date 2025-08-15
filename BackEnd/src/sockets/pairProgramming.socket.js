const { v4: uuidv4 } = require('uuid');
const aiService = require('../services/ai.service');

const rooms = new Map();
const messageData = [];

module.exports = (io, socket) => {
  // Create a new room
  socket.on('createRoom', async ({ name, userName }) => {
    const roomId = uuidv4();
    const participants = new Map();
    participants.set(socket.id, { 
      id: socket.id, 
      name: userName || 'User 1',
      isOwner: true 
    });
    
    
    rooms.set(roomId, {
      owner: socket.id,
      code: '',
      participants,
      name: name || 'Untitled Session'
    });
    
    socket.join(roomId);
    socket.emit('roomCreated', { 
      roomId,
      participants: Array.from(participants.values())
    });
    console.log(`🚪 Room created: ${roomId} by ${socket.id}`);
  });


  socket.on("sendMessage", (data) => {
    messageData.push(data);
    io.emit("receiveMessage", data);
  });
  
  // Join an existing room
  socket.on('joinRoom', async ({ roomId, userName }) => {
    if (!rooms.has(roomId)) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    const room = rooms.get(roomId);
    
    // Check if username already exists in room
    const usernameExists = Array.from(room.participants.values()).some(
      p => p.name.toLowerCase() === userName.toLowerCase()
    );
    
    if (usernameExists) {
      socket.emit('error', { message: 'Username already taken in this room' });
      return;
    }

    room.participants.set(socket.id, { 
      id: socket.id, 
      name: userName || `User ${room.participants.size + 1}`,
      isOwner: false
    });
    
    socket.join(roomId);
    
    // Send current state to new participant
    socket.emit('roomJoined', { 
      code: room.code,
      participants: Array.from(room.participants.values()),
      roomName: room.name
    });
    
    // Notify others in the room about the new participant
    io.to(roomId).emit('participantJoined', {
      newParticipant: room.participants.get(socket.id),
      participants: Array.from(room.participants.values())
    });
    
    console.log(`👋 ${socket.id} (${userName}) joined room ${roomId}`);
  });

  // Handle code changes
  socket.on('codeChange', ({ roomId, code }) => {
    if (!rooms.has(roomId)) return;

    const room = rooms.get(roomId);
    room.code = code;
    
    // Broadcast to all except sender
    socket.to(roomId).emit('codeUpdate', { code });
  });

  // Handle collaborative code review
  socket.on('requestReview', async ({ roomId }) => {
    if (!rooms.has(roomId)) return;

    const room = rooms.get(roomId);
    if (!room.code) {
      socket.emit('reviewResult', { error: 'No code to review' });
      return;
    }

    try {
      const review = await aiService(room.code);
      io.to(roomId).emit('reviewResult', { review });
    } catch (error) {
      io.to(roomId).emit('reviewResult', { 
        error: 'Failed to generate review',
        details: error.message
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    rooms.forEach((room, roomId) => {
      if (room.participants.has(socket.id)) {
        const wasOwner = room.owner === socket.id;
        const participant = room.participants.get(socket.id);
        
        room.participants.delete(socket.id);

        // Transfer ownership if owner leaves
        if (wasOwner && room.participants.size > 0) {
          const [newOwnerId] = room.participants.keys();
          room.owner = newOwnerId;
          room.participants.get(newOwnerId).isOwner = true;
        }

        // Notify remaining participants if any
        if (room.participants.size > 0) {
          io.to(roomId).emit('participantLeft', {
            leftParticipant: participant,
            participants: Array.from(room.participants.values()),
            newOwnerId: wasOwner ? room.owner : null
          });
        } else {
          // Clean up empty rooms
          rooms.delete(roomId);
          console.log(`🚪 Room ${roomId} closed (no participants left)`);
        }

        console.log(`👋 ${participant?.name || socket.id} left room ${roomId}`);
      }
    });
  });
};