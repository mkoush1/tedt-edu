import express from 'express';
import {
  getAssessments,
  startAssessment,
  submitFastQuestions,
  submitPuzzleGame,
  linkCodeforces
} from '../controllers/problemSolvingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all assessments for a user
router.get('/:userId', protect, getAssessments);

// Start a new assessment
router.post('/start', protect, startAssessment);

// Submit fast questions assessment
router.post('/fast-questions', protect, submitFastQuestions);

// Submit puzzle game assessment
router.post('/puzzle-game', protect, submitPuzzleGame);

// Link Codeforces account
router.post('/codeforces', protect, linkCodeforces);

export default router; 