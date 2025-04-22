import mongoose from 'mongoose';

const puzzleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  size: {
    type: Number,
    default: 3
  },
  initialState: {
    type: [[Number]],
    required: true,
    validate: {
      validator: function(v) {
        // Ensure the grid is a square matrix
        const size = v.length;
        return v.every(row => Array.isArray(row) && row.length === size);
      },
      message: props => 'Initial state must be a square matrix'
    }
  },
  currentState: {
    type: [[Number]],
    required: true,
    validate: {
      validator: function(v) {
        // Ensure the grid is a square matrix
        const size = v.length;
        return v.every(row => Array.isArray(row) && row.length === size);
      },
      message: props => 'Current state must be a square matrix'
    }
  },
  moves: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

const Puzzle = mongoose.model('Puzzle', puzzleSchema);

export default Puzzle; 