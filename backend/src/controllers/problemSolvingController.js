import ProblemSolvingAssessment from '../models/ProblemSolvingAssessment.js';
import { validationResult } from 'express-validator';

// Get all problem solving assessments for a user
export const getAssessments = async (req, res) => {
  try {
    const { userId } = req.params;
    const assessments = await ProblemSolvingAssessment.find({ userId });
    res.json({ success: true, data: assessments });
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch assessments' });
  }
};

// Start a new assessment
export const startAssessment = async (req, res) => {
  try {
    const { userId, assessmentType } = req.body;

    // Check if user already has an active assessment
    const existingAssessment = await ProblemSolvingAssessment.findOne({
      userId,
      status: 'in-progress'
    });

    if (existingAssessment) {
      return res.status(400).json({
        success: false,
        error: 'You already have an active assessment'
      });
    }

    // Create new assessment
    const assessment = new ProblemSolvingAssessment({
      userId,
      assessmentType,
      status: 'in-progress',
      startedAt: new Date()
    });

    await assessment.save();
    res.json({ success: true, data: assessment });
  } catch (error) {
    console.error('Error starting assessment:', error);
    res.status(500).json({ success: false, error: 'Failed to start assessment' });
  }
};

// Submit fast questions assessment
export const submitFastQuestions = async (req, res) => {
  try {
    const { userId, answers } = req.body;

    const assessment = await ProblemSolvingAssessment.findOne({
      userId,
      assessmentType: 'fast-questions',
      status: 'in-progress'
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'No active assessment found'
      });
    }

    // Calculate score and update assessment
    const score = calculateFastQuestionsScore(answers);
    assessment.fastQuestions.answers = answers;
    assessment.fastQuestions.totalScore = score;
    assessment.status = 'completed';
    assessment.completedAt = new Date();
    assessment.overallScore = score;
    assessment.percentage = (score / assessment.maxOverallScore) * 100;

    await assessment.save();
    res.json({ success: true, data: assessment });
  } catch (error) {
    console.error('Error submitting fast questions:', error);
    res.status(500).json({ success: false, error: 'Failed to submit assessment' });
  }
};

// Submit puzzle game assessment
export const submitPuzzleGame = async (req, res) => {
  try {
    const { userId, puzzleData } = req.body;

    const assessment = await ProblemSolvingAssessment.findOne({
      userId,
      assessmentType: 'puzzle-game',
      status: 'in-progress'
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'No active assessment found'
      });
    }

    // Calculate score and update assessment
    const score = calculatePuzzleGameScore(puzzleData);
    assessment.puzzleGame.puzzles = puzzleData;
    assessment.puzzleGame.totalScore = score;
    assessment.status = 'completed';
    assessment.completedAt = new Date();
    assessment.overallScore = score;
    assessment.percentage = (score / assessment.maxOverallScore) * 100;

    await assessment.save();
    res.json({ success: true, data: assessment });
  } catch (error) {
    console.error('Error submitting puzzle game:', error);
    res.status(500).json({ success: false, error: 'Failed to submit assessment' });
  }
};

// Link Codeforces account
export const linkCodeforces = async (req, res) => {
  try {
    const { userId, handle } = req.body;

    // Verify Codeforces handle
    const isValidHandle = await verifyCodeforcesHandle(handle);
    if (!isValidHandle) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Codeforces handle'
      });
    }

    const assessment = await ProblemSolvingAssessment.findOne({
      userId,
      assessmentType: 'codeforces'
    });

    if (assessment) {
      // Update existing assessment
      assessment.codeforces.handle = handle;
      assessment.codeforces.lastUpdated = new Date();
    } else {
      // Create new assessment
      assessment = new ProblemSolvingAssessment({
        userId,
        assessmentType: 'codeforces',
        codeforces: {
          handle,
          lastUpdated: new Date()
        }
      });
    }

    await assessment.save();
    res.json({ success: true, data: assessment });
  } catch (error) {
    console.error('Error linking Codeforces account:', error);
    res.status(500).json({ success: false, error: 'Failed to link Codeforces account' });
  }
};

// Helper functions
const calculateFastQuestionsScore = (answers) => {
  // Implement scoring logic for fast questions
  let score = 0;
  answers.forEach(answer => {
    if (answer.isCorrect) {
      score += 1;
    }
  });
  return score;
};

const calculatePuzzleGameScore = (puzzleData) => {
  // Implement scoring logic for puzzle game
  let score = 0;
  puzzleData.forEach(puzzle => {
    if (puzzle.completed) {
      score += puzzle.difficulty === 'easy' ? 1 : 
               puzzle.difficulty === 'medium' ? 2 : 3;
    }
  });
  return score;
};

const verifyCodeforcesHandle = async (handle) => {
  try {
    // Make API call to Codeforces to verify handle
    const response = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
    const data = await response.json();
    return data.status === 'OK';
  } catch (error) {
    console.error('Error verifying Codeforces handle:', error);
    return false;
  }
}; 