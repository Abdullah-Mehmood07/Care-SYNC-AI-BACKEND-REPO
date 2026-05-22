import mongoose from 'mongoose';

const verificationTokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true
    },
    token: {
        type: String,
        required: [true, 'Token is required'],
        unique: true
    },
    type: {
        type: String,
        enum: ['email_verification', 'password_reset'],
        required: [true, 'Token type is required']
    },
    expiresAt: {
        type: Date,
        required: [true, 'Expiration date is required'],
        index: { expireAfterSeconds: 0 }
    },
    used: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for faster queries
verificationTokenSchema.index({ email: 1, type: 1 });
verificationTokenSchema.index({ token: 1 });

const VerificationToken = mongoose.model('VerificationToken', verificationTokenSchema);
export default VerificationToken;
