import mongoose from 'mongoose';

const assessmentResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assessmentType: {
    type: String,
    required: true
  },
  answers: [{
    questionNumber: Number,
    answer: mongoose.Schema.Types.Mixed,
    score: Number
  }],
  sectionScores: [{
    section: String,
    score: Number,
    maxScore: Number
  }],
  totalScore: Number,
  maxTotalScore: Number,
  percentage: Number,
  completedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
assessmentResultSchema.index({ userId: 1, assessmentType: 1 });

const AssessmentResult = mongoose.model('AssessmentResult', assessmentResultSchema);

export default AssessmentResult; 