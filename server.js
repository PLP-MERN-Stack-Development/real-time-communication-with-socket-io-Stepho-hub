import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
    credentials: false
  }
});

app.use(cors({ origin: "*" }));
app.use(express.json());

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// In-memory storage for demo purposes
let users = [];
let messages = {};
let onlineUsers = new Set();
let typingUsers = new Set();

// Unique ID generator to prevent duplicate keys
const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}`;
};

// No authentication middleware

io.on('connection', (socket) => {
  console.log('User connected');

  // Send current online users to the newly connected client
  socket.emit('onlineUsers', Array.from(onlineUsers));

  // Wait for user to set username
  socket.on('setUsername', (username) => {
    socket.user = { username };

    // Add user to online users
    onlineUsers.add(username);
    // Emit to ALL connected clients, not just this one
    io.emit('onlineUsers', Array.from(onlineUsers));
  });

  // Handle request for current online users
  socket.on('getOnlineUsers', () => {
    socket.emit('onlineUsers', Array.from(onlineUsers));
  });

  // Join default room
  socket.join('general');

  // Handle joining rooms
  socket.on('joinRoom', (room) => {
    socket.join(room);
    if (!messages[room]) {
      messages[room] = [];
    }
    socket.emit('roomMessages', messages[room]);
    // Notify others in the room
    if (socket.user) {
      socket.to(room).emit('userJoinedRoom', { username: socket.user.username, room });
    }
  });

  // Handle leaving rooms
  socket.on('leaveRoom', (room) => {
    socket.leave(room);
    // Notify others in the room
    if (socket.user) {
      socket.to(room).emit('userLeftRoom', { username: socket.user.username, room });
    }
  });

  // Handle private messaging
  socket.on('joinPrivate', (otherUser) => {
    const room = [socket.user.username, otherUser].sort().join('-');
    socket.join(room);
    if (!messages[room]) {
      messages[room] = [];
    }
    socket.emit('privateMessages', messages[room]);
  });

  // Handle sending messages
  socket.on('sendMessage', (data) => {
    if (!socket.user) return;
    const { room, message, isPrivate, recipient } = data;
    const msg = {
      id: generateUniqueId(),
      user: socket.user.username,
      message,
      timestamp: new Date(),
      readBy: [socket.user.username],
      reactions: {}
    };

    if (isPrivate) {
      const privateRoom = [socket.user.username, recipient].sort().join('-');
      if (!messages[privateRoom]) messages[privateRoom] = [];
      messages[privateRoom].push(msg);
      socket.to(privateRoom).emit('message', msg);
    } else {
      if (!messages[room]) messages[room] = [];
      messages[room].push(msg);
      socket.to(room).emit('message', msg);
    }
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    if (!socket.user) return;
    const { room, isPrivate, recipient } = data;
    const typingKey = isPrivate ? `${socket.user.username}-${recipient}` : `${socket.user.username}-${room}`;
    typingUsers.add(typingKey);
    if (isPrivate) {
      const privateRoom = [socket.user.username, recipient].sort().join('-');
      socket.to(privateRoom).emit('userTyping', { user: socket.user.username, typing: true });
    } else {
      socket.to(room).emit('userTyping', { user: socket.user.username, typing: true });
    }
  });

  socket.on('stopTyping', (data) => {
    if (!socket.user) return;
    const { room, isPrivate, recipient } = data;
    const typingKey = isPrivate ? `${socket.user.username}-${recipient}` : `${socket.user.username}-${room}`;
    typingUsers.delete(typingKey);
    if (isPrivate) {
      const privateRoom = [socket.user.username, recipient].sort().join('-');
      socket.to(privateRoom).emit('userTyping', { user: socket.user.username, typing: false });
    } else {
      socket.to(room).emit('userTyping', { user: socket.user.username, typing: false });
    }
  });

  // Handle read receipts
  socket.on('markAsRead', (data) => {
    const { messageId, room, isPrivate, recipient } = data;
    const targetMessages = isPrivate ? messages[[socket.user.username, recipient].sort().join('-')] : messages[room];
    if (targetMessages) {
      const msg = targetMessages.find(m => m.id === messageId);
      if (msg && !msg.readBy.includes(socket.user.username)) {
        msg.readBy.push(socket.user.username);
        if (isPrivate) {
          const privateRoom = [socket.user.username, recipient].sort().join('-');
          io.to(privateRoom).emit('readReceipt', { messageId, user: socket.user.username });
        } else {
          io.to(room).emit('readReceipt', { messageId, user: socket.user.username });
        }
      }
    }
  });

  // Handle message reactions
  socket.on('addReaction', (data) => {
    const { messageId, reaction, room, isPrivate, recipient } = data;
    const targetMessages = isPrivate ? messages[[socket.user.username, recipient].sort().join('-')] : messages[room];
    if (targetMessages) {
      const msg = targetMessages.find(m => m.id === messageId);
      if (msg) {
        if (!msg.reactions) msg.reactions = {};
        if (!msg.reactions[reaction]) msg.reactions[reaction] = [];
        if (!msg.reactions[reaction].includes(socket.user.username)) {
          msg.reactions[reaction].push(socket.user.username);
          if (isPrivate) {
            const privateRoom = [socket.user.username, recipient].sort().join('-');
            io.to(privateRoom).emit('reactionUpdate', { messageId, reaction, user: socket.user.username });
          } else {
            io.to(room).emit('reactionUpdate', { messageId, reaction, user: socket.user.username });
          }
        }
      }
    }
  });

  // Handle message deletion
  socket.on('deleteMessage', (data) => {
    const { messageId, room } = data;
    const targetMessages = messages[room];
    if (targetMessages) {
      const messageIndex = targetMessages.findIndex(m => m.id === messageId);
      if (messageIndex !== -1) {
        const message = targetMessages[messageIndex];
        // Only allow deletion by message author
        if (message.user === socket.user.username) {
          targetMessages.splice(messageIndex, 1);
          io.to(room).emit('messageDeleted', { messageId });
        }
      }
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    if (socket.user) {
      onlineUsers.delete(socket.user.username);
      io.emit('onlineUsers', Array.from(onlineUsers));
    }
  });
});

// Auth routes
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.json({ message: 'User registered' });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ username }, JWT_SECRET);
  res.json({ token });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});