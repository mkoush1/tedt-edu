import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return v === null || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ['User', 'Supervisor'],
    default: 'User'
  },
  resetToken: String,
  resetTokenExpiry: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  console.log('\n=== Password Comparison Debug ===');
  console.log('Candidate password length:', candidatePassword ? candidatePassword.length : 0);
  console.log('Stored password length:', this.password ? this.password.length : 0);
  console.log('Stored password exists:', !!this.password);
  
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Password match result:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

const User = mongoose.model('User', userSchema);

// Clean up existing data and recreate indexes
async function initializeDatabase() {
  try {
    // Drop all indexes
    await User.collection.dropIndexes();
    console.log('Dropped all indexes');

    // Delete any documents with null or invalid emails
    await User.deleteMany({
      $or: [
        { email: null },
        { email: { $exists: false } },
        { email: { $not: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ } }
      ]
    });
    console.log('Cleaned up invalid email documents');

    // Create new index for email
    await User.collection.createIndex({ email: 1 }, { unique: true, sparse: true });
    console.log('Created new email index');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

// Run initialization
initializeDatabase();

export default User; 