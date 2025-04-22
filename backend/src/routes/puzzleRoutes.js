import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { startPuzzle, makeMove, getPuzzleState } from '../controllers/puzzleController.js';

const router = express.Router();

// Start a new puzzle game
router.post('/start', authenticateToken, startPuzzle);

// Make a move in the puzzle
router.post('/:puzzleId/move', authenticateToken, makeMove);

// Get current puzzle state
router.get('/:puzzleId', authenticateToken, getPuzzleState);

export default router; 