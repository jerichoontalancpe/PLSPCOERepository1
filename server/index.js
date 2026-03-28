const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://plspcoe-repository1.vercel.app', 'https://plspcoerepository1.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize database and start server
initDatabase().then(() => {
  console.log('✅ Database initialized');
  
  // Import routes after database is ready
  const authRoutes = require('./routes/auth');
  const projectRoutes = require('./routes/projects');
  const achievementRoutes = require('./routes/achievements');
  const settingsRoutes = require('./routes/settings');
  
  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/achievements', achievementRoutes);
  app.use('/api/settings', settingsRoutes);
  
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('❌ Failed to initialize database:', err);
});
