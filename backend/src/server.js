import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import supervisorRoutes from './routes/supervisorRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import problemSolvingRoutes from './routes/problemSolvingRoutes.js';
import speakingAssessmentRoutes from '../routes/speakingAssessmentRoutes.js';
import writingAssessmentRoutes from '../routes/writingAssessmentRoutes.js';
import cloudinaryRoutes from '../routes/cloudinaryRoutes.js';
import { fileURLToPath } from 'url';
import path from 'path';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173', 'http://localhost:3000', 'https://edusoft.vercel.app'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/supervisors', supervisorRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/problem-solving', problemSolvingRoutes);
app.use('/api/speaking-assessment', speakingAssessmentRoutes);
app.use('/api/writing-assessment', writingAssessmentRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../frontend/dist', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
  });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 