import mongoose from 'mongoose';

const testQuestionSchema = new mongoose.Schema({
  assessmentType: {
    type: String,
    required: true,
    enum: ['leadership', 'technical', 'soft-skills'], // Add more types as needed
    default: 'leadership'
  },
  section: {
    type: String,
    required: true
  },
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
    value: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  }],
  questionType: {
    type: String,
    required: true,
    enum: ['multiple-choice', 'rating'],
    default: 'rating'
  },
  maxScore: {
    type: Number,
    required: true,
    default: 5
  },
  sectionWeight: {
    type: Number,
    required: true,
    default: 1
  }
}, {
  timestamps: true
});

// Ensure unique combination of assessment type and question number
testQuestionSchema.index({ assessmentType: 1, questionNumber: 1 }, { unique: true });

const TestQuestion = mongoose.model('TestQuestion', testQuestionSchema);

export default TestQuestion; 