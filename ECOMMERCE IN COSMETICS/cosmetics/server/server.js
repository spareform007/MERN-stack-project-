/*
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './db/db.js';
import { seedDatabase } from './db/seedData.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import expertRoutes from './routes/expertRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory or root
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const server = http.createServer(app);

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Connect to MongoDB & Seed
connectDB().then(() => {
  seedDatabase();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/expert', expertRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: "MAE' BEAUTY Luxury E-Commerce Engine",
    timestamp: new Date().toISOString()
  });
});

// Real-Time Socket.IO Live Beauty Expert Chat Engine
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  socket.on('join_chat', ({ userId, userName, role }) => {
    socket.join('beauty_lounge');
    console.log(`[Socket.IO] ${userName} (${role}) joined beauty lounge.`);

    socket.emit('receive_message', {
      sender: 'Beauty Advisor Bot',
      role: 'bot',
      text: `Welcome to MAE' BEAUTY Private Concierge, ${userName}. A certified Beauty Artist is on standby to assist with shade matching and skin consultations.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  });

  socket.on('send_message', (data) => {
    io.to('beauty_lounge').emit('receive_message', {
      sender: data.userName || 'Anonymous',
      role: data.role || 'customer',
      text: data.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` MAE' BEAUTY API Engine Running on Port ${PORT}`);
  console.log(` Socket.IO Live Chat Server Active`);
  console.log(`====================================================`);
});
*/

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './db/db.js';
import { seedDatabase } from './db/seedData.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import expertRoutes from './routes/expertRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory or root
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const server = http.createServer(app);

// Allowed origins array for CORS
const ALLOWED_ORIGINS = [
  'https://mern-stack-project-1-kva4.onrender.com', // Change to your actual frontend Render URL
  'http://localhost:5173',
  'http://localhost:3000'
];

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: ALLOWED_ORIGINS,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Connect to MongoDB & Seed
connectDB().then(() => {
  seedDatabase();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/expert', expertRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: "MAE' BEAUTY Luxury E-Commerce Engine",
    timestamp: new Date().toISOString()
  });
});

// Real-Time Socket.IO Live Beauty Expert Chat Engine
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  socket.on('join_chat', ({ userId, userName, role }) => {
    socket.join('beauty_lounge');
    console.log(`[Socket.IO] ${userName} (${role}) joined beauty lounge.`);

    socket.emit('receive_message', {
      sender: 'Beauty Advisor Bot',
      role: 'bot',
      text: `Welcome to MAE' BEAUTY Private Concierge, ${userName}. A certified Beauty Artist is on standby to assist with shade matching and skin consultations.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  });

  socket.on('send_message', (data) => {
    io.to('beauty_lounge').emit('receive_message', {
      sender: data.userName || 'Anonymous',
      role: data.role || 'customer',
      text: data.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` MAE' BEAUTY API Engine Running on Port ${PORT}`);
  console.log(` Socket.IO Live Chat Server Active`);
  console.log(`====================================================`);
});

