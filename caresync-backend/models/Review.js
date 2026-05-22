import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: [true, 'Doctor ID is required']
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Patient ID is required']
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5']
    },
    comment: {
        type: String,
        trim: true,
        maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    categories: {
        communication: {
            type: Number,
            min: 1,
            max: 5,
            default: null
        },
        punctuality: {
            type: Number,
            min: 1,
            max: 5,
            default: null
        },
        expertise: {
            type: Number,
            min: 1,
            max: 5,
            default: null
        }
    },
    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for faster queries
reviewSchema.index({ doctorId: 1 });
reviewSchema.index({ patientId: 1 });
reviewSchema.index({ doctorId: 1, createdAt: -1 });

// Ensure one review per doctor-patient pair
reviewSchema.index({ doctorId: 1, patientId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
