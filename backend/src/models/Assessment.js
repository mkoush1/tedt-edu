import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '/eduSoft_logo.png'
  },
  category: {
    type: String,
    required: true
  },
  duration: {
    type: Number,  // in minutes
    default: 30
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Assessment = mongoose.model('Assessment', assessmentSchema);

export default Assessment; 