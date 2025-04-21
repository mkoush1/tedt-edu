import mongoose from 'mongoose';

const leadershipQuestionSchema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true,
    enum: ['Vision', 'Ethics', 'Communication', 'Team Management', 'Decision Making', 'Emotional Intelligence', 'Adaptability', 'Innovation', 'Development']
  },
  maxScore: {
    type: Number,
    default: 5
  }
});

const LeadershipQuestion = mongoose.model('LeadershipQuestion', leadershipQuestionSchema);

export default LeadershipQuestion; 