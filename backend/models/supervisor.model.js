import mongoose from "mongoose";

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
        lowercase: true
    },
    Password: {
        type: String,
        required: true,
        minlength: 6
    }
}, {
    timestamps: true
});

const Supervisor = mongoose.model('Supervisor', supervisorSchema);

export default Supervisor;