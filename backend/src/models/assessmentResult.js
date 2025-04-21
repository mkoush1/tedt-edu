import mongoose from 'mongoose';

const assessmentResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assessmentType: {
    type: String,
    required: true,
    enum: ['leadership', 'technical', 'soft-skills'],
    default: 'leadership'
  },
  answers: [{
    questionNumber: {
      type: Number,
      required: true
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  }],
  sectionScores: [{
    section: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    maxScore: {
      type: Number,
      required: true
    }
  }],
  totalScore: {
    type: Number,
    required: true
  },
  maxTotalScore: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient querying
assessmentResultSchema.index({ userId: 1, assessmentType: 1 });

const AssessmentResult = mongoose.model('AssessmentResult', assessmentResultSchema);

export default AssessmentResult; 