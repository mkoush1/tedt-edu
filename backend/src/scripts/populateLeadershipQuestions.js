import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Define the schema
const leadershipQuestionSchema = new mongoose.Schema({
  questionNumber: { type: Number, required: true },
  questionText: { type: String, required: true },
  section: { type: String, required: true },
  maxScore: { type: Number, required: true }
});

// Check if model exists before creating it
const LeadershipQuestion = mongoose.models.LeadershipQuestion || mongoose.model('LeadershipQuestion', leadershipQuestionSchema);

const leadershipQuestions = [
  {
    questionNumber: 1,
    questionText: "Do you have a clear vision for the future that inspires your team?",
    section: "Vision",
    maxScore: 5
  },
  {
    questionNumber: 2,
    questionText: "Do you consistently follow ethical values and principles when making decisions?",
    section: "Ethics",
    maxScore: 5
  },
  {
    questionNumber: 3,
    questionText: "Do you actively involve your team in setting shared goals and visions?",
    section: "Vision",
    maxScore: 5
  },
  {
    questionNumber: 4,
    questionText: "Do you communicate clearly and effectively with your team about goals and expectations?",
    section: "Communication",
    maxScore: 5
  },
  {
    questionNumber: 5,
    questionText: "Do you regularly motivate your team by giving constructive feedback?",
    section: "Team Management",
    maxScore: 5
  },
  {
    questionNumber: 6,
    questionText: "Do you demonstrate enthusiasm and positivity that inspires and energizes your team?",
    section: "Team Management",
    maxScore: 5
  },
  {
    questionNumber: 7,
    questionText: "Do you build a work environment based on trust and mutual respect?",
    section: "Team Management",
    maxScore: 5
  },
  {
    questionNumber: 8,
    questionText: "Do you delegate tasks effectively, matching each task to your team members' strengths and abilities?",
    section: "Team Management",
    maxScore: 5
  },
  {
    questionNumber: 9,
    questionText: "Do you encourage teamwork and cooperation to achieve shared objectives?",
    section: "Team Management",
    maxScore: 5
  },
  {
    questionNumber: 10,
    questionText: "Do you carefully analyze available information and options before making important decisions?",
    section: "Decision Making",
    maxScore: 5
  },
  {
    questionNumber: 11,
    questionText: "Do you take full responsibility for your decisions and learn from their outcomes?",
    section: "Decision Making",
    maxScore: 5
  },
  {
    questionNumber: 12,
    questionText: "Do you encourage your team to think critically and creatively to solve problems?",
    section: "Decision Making",
    maxScore: 5
  },
  {
    questionNumber: 13,
    questionText: "Can you effectively manage your emotions and remain calm under pressure?",
    section: "Emotional Intelligence",
    maxScore: 5
  },
  {
    questionNumber: 14,
    questionText: "Do you show empathy and understand the feelings and needs of others?",
    section: "Emotional Intelligence",
    maxScore: 5
  },
  {
    questionNumber: 15,
    questionText: "Do you regularly assess and actively work on developing your emotional intelligence?",
    section: "Emotional Intelligence",
    maxScore: 5
  },
  {
    questionNumber: 16,
    questionText: "Are you capable of quickly adapting to changes and new challenges?",
    section: "Adaptability",
    maxScore: 5
  },
  {
    questionNumber: 17,
    questionText: "Do you encourage your team to think innovatively and creatively?",
    section: "Innovation",
    maxScore: 5
  },
  {
    questionNumber: 18,
    questionText: "Do you support new ideas and actively implement innovative solutions at work?",
    section: "Innovation",
    maxScore: 5
  },
  {
    questionNumber: 19,
    questionText: "Do you actively encourage your team members to develop their skills and pursue their professional goals?",
    section: "Development",
    maxScore: 5
  },
  {
    questionNumber: 20,
    questionText: "Do you consistently provide constructive feedback to help your team grow and improve?",
    section: "Development",
    maxScore: 5
  }
];

const populateQuestions = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edusoft', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('Connected to MongoDB');

    // Clear existing questions
    await LeadershipQuestion.deleteMany({});
    console.log('Cleared existing questions');

    // Insert new questions
    console.log('Attempting to insert questions:', leadershipQuestions.length);
    const result = await LeadershipQuestion.insertMany(leadershipQuestions);
    console.log('Successfully populated leadership questions. Count:', result.length);

    // Verify questions were inserted
    const count = await LeadershipQuestion.countDocuments();
    console.log('Total questions in database:', count);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error populating questions:', error);
    process.exit(1);
  }
};

populateQuestions(); 