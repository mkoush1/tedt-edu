const mongoose = require('mongoose');

const leadershipQuestionSchema = new mongoose.Schema({
  questionNumber: Number,
  questionText: String,
  section: String,
  maxScore: Number
});

mongoose.connect('mongodb://127.0.0.1:27017/edusoft', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');
  
  const LeadershipQuestion = mongoose.model('LeadershipQuestion', leadershipQuestionSchema);
  
  try {
    const questions = await LeadershipQuestion.find({});
    console.log(`Found ${questions.length} questions:`);
    
    questions.forEach(q => {
      console.log(`\nQuestion #${q.questionNumber}`);
      console.log(`Text: ${q.questionText}`);
      console.log(`Section: ${q.section}`);
      console.log(`Max Score: ${q.maxScore}`);
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
  
  await mongoose.disconnect();
  console.log('\nDisconnected from MongoDB');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
}); 