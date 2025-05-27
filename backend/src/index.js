import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import puzzleRoutes from './routes/puzzleRoutes.js';
import writingAssessmentRoutes from '../routes/writingAssessmentRoutes.js';
import speakingAssessmentRoutes from '../routes/speakingAssessmentRoutes.js';
import cloudinaryRoutes from '../routes/cloudinaryRoutes.js';
import speakingQuestionRoutes from './routes/speakingQuestionRoutes.js';

// Load environment variables
dotenv.config();

// Verify MongoDB URI
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Found' : 'Not Found');

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));  // Increased limit for larger video submissions
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
  useTempFiles: false,
  abortOnLimit: true,
  responseOnLimit: 'File size limit exceeded (50MB)'
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  
  // Only log body for non-GET requests and if it's not too large
  if (req.method !== 'GET' && req.body) {
    const bodyLog = { ...req.body };
    
    // Truncate large text fields for logging
    Object.keys(bodyLog).forEach(key => {
      if (typeof bodyLog[key] === 'string' && bodyLog[key].length > 100) {
        bodyLog[key] = bodyLog[key].substring(0, 100) + '... [truncated]';
      }
    });
    
    console.log('Body:', JSON.stringify(bodyLog, null, 2));
  }
  
  // Log the origin for CORS debugging
  if (req.headers.origin) {
    console.log('Request origin:', req.headers.origin);
  }
  
  next();
});

// CORS configuration with detailed logging
const corsOptions = {
  origin: function(origin, callback) {
    console.log('CORS request from origin:', origin);
    // Allow any origin
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};

app.use(cors(corsOptions));

// Log successful CORS setup
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] Response ${res.statusCode} ${res.statusMessage}`);
  });
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/puzzle', puzzleRoutes);
app.use('/api/writing-assessment', writingAssessmentRoutes);
app.use('/api/speaking-assessment', speakingAssessmentRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);
app.use('/api/speaking-questions', speakingQuestionRoutes);

// Test route to verify server is working
app.get('/api/test', (req, res) => {
  console.log('Test route accessed');
  res.json({ message: 'API server is running' });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('MongoDB URI is not defined in environment variables');
      process.exit(1);
    }

    console.log('Attempting to connect to MongoDB...');
    
    // Parse and clean up the MongoDB URI
    const mongoURI = process.env.MONGODB_URI.replace(/\\n/g, '').trim();
    console.log('Using cleaned URI:', mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')); // Hide credentials in logs
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Increased timeout for better reliability
      socketTimeoutMS: 45000,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
    
    // Verify connection by listing collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

    // Use dynamic import for the service
    try {
      const { default: speakingQuestionService } = await import('./services/speakingQuestionService.js');
      // Seed the initial speaking questions
      await speakingQuestionService.seedInitialQuestions();
      console.log('Speaking questions database checked');
    } catch (err) {
      console.error('Error seeding speaking questions:', err);
    }
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Error details:', {
      name: error.name,
      code: error.code,
      codeName: error.codeName,
      stack: error.stack
    });
    process.exit(1);
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Initialize database connection
connectDB();

// Start server
const PORT = 5001; // Hardcoded to 5001 to avoid conflicts
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test the API at: http://localhost:${PORT}/api/test`);
  console.log(`Writing assessment endpoint: http://localhost:${PORT}/api/writing-assessment/evaluate`);
  console.log(`Speaking assessment endpoint: http://localhost:${PORT}/api/speaking-assessment/evaluate`);
}); 