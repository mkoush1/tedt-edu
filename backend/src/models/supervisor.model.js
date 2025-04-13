import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const supervisorSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true,
        trim: true
    },
    UserID: {
        type: Number,
        required: true,
        default: () => Math.floor(100000 + Math.random() * 900000), // Auto-generates 6-digit number
        unique: true
    },
    SupervisorID: {
        type: Number,
        required: true,
        default: () => Math.floor(100000 + Math.random() * 900000), // Auto-generates 6-digit number
        unique: true
    },
    Email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    Password: {
        type: String,
        required: true
    },
    resetToken: {
        type: String,
        default: undefined
    },
    resetTokenExpiry: {
        type: Date,
        default: undefined
    }
}, {
    timestamps: true
});

// Hash password before saving
supervisorSchema.pre('save', async function(next) {
    if (!this.isModified('Password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.Password = await bcrypt.hash(this.Password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
supervisorSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.Password);
};

const Supervisor = mongoose.model('Supervisor', supervisorSchema);

export default Supervisor; 