import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        minlength: [2, 'Full name must be at least 2 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        sparse: true,
        index: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    role: {
        type: String,
        enum: {
            values: ['User', 'Supervisor'],
            message: 'Role must be either User or Supervisor'
        },
        default: 'User'
    },
    userId: {
        type: Number,
        required: true,
        default: () => Math.floor(100000 + Math.random() * 900000),
        unique: true
    },
    softSkillScore: {
        type: Number,
        default: 0,
        min: [0, 'SoftSkillScore cannot be less than 0'],
        max: [100, 'SoftSkillScore cannot be greater than 100']
    },
    progress: {
        type: Number,
        default: 0,
        min: [0, 'Progress cannot be less than 0'],
        max: [100, 'Progress cannot be greater than 100']
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.password;
            delete ret.emailVerificationToken;
            delete ret.passwordResetToken;
            return ret;
        }
    }
});

// Create indexes
userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ userId: 1 }, { unique: true });

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
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

// Static method to check if email exists
userSchema.statics.emailExists = async function(email) {
    const user = await this.findOne({ email });
    return !!user;
};

// Ensure indexes are created
userSchema.on('index', function(error) {
    if (error) {
        console.error('Error creating index:', error);
    } else {
        console.log('Indexes created successfully');
    }
});

const User = mongoose.model('User', userSchema);

export default User;