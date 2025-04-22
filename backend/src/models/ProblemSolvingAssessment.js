import mongoose from 'mongoose';

const problemSolvingAssessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assessmentType: {
    type: String,
    required: true,
    enum: ['fast-questions', 'puzzle-game', 'codeforces'],
    default: 'fast-questions'
  },
  image: {
    type: String,
    default: '/eduSoft_logo.png'
  },
  
  // For Fast Questions Assessment
  fastQuestions: {
    questions: [{
      questionNumber: {
        type: Number,
        required: true
      },
      questionText: {
        type: String,
        required: true
      },
      options: [{
        text: {
          type: String,
          required: true
        },
        isCorrect: {
          type: Boolean,
          required: true
        }
      }],
      timeLimit: {
        type: Number, // in seconds
        required: true
      }
    }],
    totalScore: {
      type: Number,
      default: 0
    },
    maxScore: {
      type: Number,
      required: true
    },
    timeTaken: {
      type: Number, // in seconds
      default: 0
    }
  },
  // For Puzzle Game Assessment
  puzzleGame: {
    puzzles: [{
      puzzleId: {
        type: String,
        required: true
      },
      difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
      },
      moves: {
        type: Number,
        required: true
      },
      timeTaken: {
        type: Number, // in seconds
        required: true
      },
      completed: {
        type: Boolean,
        default: false
      }
    }],
    totalScore: {
      type: Number,
      default: 0
    },
    maxScore: {
      type: Number,
      required: true
    }
  },
  // For Codeforces Integration
  codeforces: {
    handle: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      default: 0
    },
    solvedProblems: {
      type: Number,
      default: 0
    },
    contests: [{
      contestId: {
        type: Number,
        required: true
      },
      rank: {
        type: Number,
        required: true
      },
      solved: {
        type: Number,
        required: true
      }
    }],
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  // Common fields for all assessment types
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  },
  startedAt: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  },
  overallScore: {
    type: Number,
    default: 0
  },
  maxOverallScore: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
problemSolvingAssessmentSchema.index({ userId: 1, assessmentType: 1 });
problemSolvingAssessmentSchema.index({ 'codeforces.handle': 1 });

const ProblemSolvingAssessment = mongoose.model('ProblemSolvingAssessment', problemSolvingAssessmentSchema);

export default ProblemSolvingAssessment; 