import mongoose from 'mongoose';

const videoCallSchema = new mongoose.Schema({
    initiatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Initiator is required']
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Recipient is required']
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        default: null
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date,
        default: null
    },
    duration: {
        type: Number,
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'completed', 'failed'],
        default: 'pending'
    },
    recordingUrl: {
        type: String,
        default: null
    },
    notes: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Index for faster queries
videoCallSchema.index({ initiatorId: 1, createdAt: -1 });
videoCallSchema.index({ recipientId: 1, createdAt: -1 });

const VideoCall = mongoose.model('VideoCall', videoCallSchema);
export default VideoCall;
