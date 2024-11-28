import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const users = new Map();

io.on('connection', (socket) => {
  // console.log('User connected:', socket.id);

  socket.on('user:join', (username) => {
    users.set(socket.id, { username, online: true });
    io.emit('users:update', Array.from(users.values()));
  });

  socket.on('message:send', (message) => {
    const user = users.get(socket.id);
    if (user) {
      io.emit('message:receive', {
        id: Date.now(),
        text: message,
        user: user.username,
        timestamp: new Date().toISOString()
      });
    }
  });

  socket.on('typing:start', () => {
    const user = users.get(socket.id);
    if (user) {
      socket.broadcast.emit('user:typing', user.username);
    }
  });

  socket.on('typing:stop', () => {
    socket.broadcast.emit('user:stop-typing');
  });

  socket.on('disconnect', () => {
    users.delete(socket.id);
    io.emit('users:update', Array.from(users.values()));
    // console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`);
});