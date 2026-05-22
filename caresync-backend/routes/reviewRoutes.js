import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import Review from '../models/Review.js';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';

const router = express.Router();

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { doctorId, rating, comment, categories } = req.body;

        // Validation
        if (!doctorId || !rating) {
            return res.status(400).json({
                success: false,
                message: 'Please provide doctorId and rating'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        // Check if doctor exists
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Check if patient has an appointment with this doctor
        const appointment = await Appointment.findOne({
            patientId: req.user._id,
            doctorId: doctorId,
            status: 'Completed'
        });

        // Check if review already exists
        const existingReview = await Review.findOne({
            doctorId: doctorId,
            patientId: req.user._id
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this doctor'
            });
        }

        const review = new Review({
            doctorId,
            patientId: req.user._id,
            rating,
            comment,
            categories: categories || {},
            verified: !!appointment
        });

        await review.save();

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating review',
            error: error.message
        });
    }
});

// @desc    Get reviews for a doctor
// @route   GET /api/reviews/doctor/:doctorId
// @access  Public
router.get('/doctor/:doctorId', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Check if doctor exists
        const doctor = await Doctor.findById(req.params.doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        const reviews = await Review.find({ doctorId: req.params.doctorId })
            .populate('patientId', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Review.countDocuments({ doctorId: req.params.doctorId });

        res.status(200).json({
            success: true,
            data: reviews,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews',
            error: error.message
        });
    }
});

// @desc    Get review statistics for a doctor
// @route   GET /api/reviews/stats/doctor/:doctorId
// @access  Public
router.get('/stats/doctor/:doctorId', async (req, res) => {
    try {
        const reviews = await Review.find({ doctorId: req.params.doctorId });

        if (reviews.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    totalReviews: 0,
                    averageRating: 0,
                    ratingBreakdown: {}
                }
            });
        }

        const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2);

        const ratingBreakdown = {
            5: reviews.filter(r => r.rating === 5).length,
            4: reviews.filter(r => r.rating === 4).length,
            3: reviews.filter(r => r.rating === 3).length,
            2: reviews.filter(r => r.rating === 2).length,
            1: reviews.filter(r => r.rating === 1).length
        };

        const categoryAverages = {
            communication: reviews.filter(r => r.categories.communication).reduce((sum, r) => sum + r.categories.communication, 0) / reviews.length || 0,
            punctuality: reviews.filter(r => r.categories.punctuality).reduce((sum, r) => sum + r.categories.punctuality, 0) / reviews.length || 0,
            expertise: reviews.filter(r => r.categories.expertise).reduce((sum, r) => sum + r.categories.expertise, 0) / reviews.length || 0
        };

        res.status(200).json({
            success: true,
            data: {
                totalReviews: reviews.length,
                averageRating: parseFloat(averageRating),
                verifiedReviews: reviews.filter(r => r.verified).length,
                ratingBreakdown,
                categoryAverages
            }
        });
    } catch (error) {
        console.error('Error fetching review stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching review statistics',
            error: error.message
        });
    }
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check ownership
        if (review.patientId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this review'
            });
        }

        // Update allowed fields
        if (req.body.rating !== undefined) {
            if (req.body.rating < 1 || req.body.rating > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'Rating must be between 1 and 5'
                });
            }
            review.rating = req.body.rating;
        }

        if (req.body.comment !== undefined) {
            review.comment = req.body.comment;
        }

        if (req.body.categories) {
            review.categories = { ...review.categories, ...req.body.categories };
        }

        await review.save();

        res.status(200).json({
            success: true,
            data: review
        });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating review',
            error: error.message
        });
    }
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check ownership or admin
        if (review.patientId.toString() !== req.user._id.toString() && req.user.role !== 'Web Admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this review'
            });
        }

        await Review.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting review',
            error: error.message
        });
    }
});

export default router;
