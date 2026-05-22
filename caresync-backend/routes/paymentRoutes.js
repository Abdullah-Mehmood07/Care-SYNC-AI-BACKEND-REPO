import express from 'express';
import { protect, hospitalAdminOnly } from '../middleware/authMiddleware.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';

const router = express.Router();

// @desc    Create payment
// @route   POST /api/payments
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { appointmentId, amount, currency, method, metadata } = req.body;

        // Validation
        if (!amount) {
            return res.status(400).json({
                success: false,
                message: 'Amount is required'
            });
        }

        if (amount < 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount cannot be negative'
            });
        }

        // Generate transaction ID
        const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const invoiceId = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        const payment = new Payment({
            userId: req.user._id,
            appointmentId,
            amount,
            currency: currency || 'USD',
            method: method || 'card',
            transactionId,
            invoiceId,
            metadata: metadata || new Map(),
            status: 'pending'
        });

        await payment.save();

        res.status(201).json({
            success: true,
            data: payment
        });
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating payment',
            error: error.message
        });
    }
});

// @desc    Get payments for a user
// @route   GET /api/payments/user/:userId
// @access  Private
router.get('/user/:userId', protect, async (req, res) => {
    try {
        // Check authorization
        if (req.user._id.toString() !== req.params.userId && req.user.role !== 'Web Admin' && req.user.role !== 'Hospital Admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view these payments'
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const payments = await Payment.find({ userId: req.params.userId })
            .populate('appointmentId', 'date timeSlot status')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Payment.countDocuments({ userId: req.params.userId });

        res.status(200).json({
            success: true,
            data: payments,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching payments',
            error: error.message
        });
    }
});

// @desc    Get payment details
// @route   GET /api/payments/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('userId', 'name email')
            .populate('appointmentId');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        // Check authorization
        if (payment.userId._id.toString() !== req.user._id.toString() && 
            req.user.role !== 'Web Admin' && 
            req.user.role !== 'Hospital Admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this payment'
            });
        }

        res.status(200).json({
            success: true,
            data: payment
        });
    } catch (error) {
        console.error('Error fetching payment:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching payment',
            error: error.message
        });
    }
});

// @desc    Update payment status
// @route   PUT /api/payments/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, hospitalAdminOnly, async (req, res) => {
    try {
        const { status } = req.body;

        // Validation
        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        const validStatuses = ['pending', 'completed', 'failed', 'refunded'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Status must be one of: ${validStatuses.join(', ')}`
            });
        }

        const payment = await Payment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        res.status(200).json({
            success: true,
            data: payment
        });
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating payment status',
            error: error.message
        });
    }
});

// @desc    Get payment statistics
// @route   GET /api/payments/stats/dashboard
// @access  Private/Admin
router.get('/stats/dashboard', protect, hospitalAdminOnly, async (req, res) => {
    try {
        const totalPayments = await Payment.countDocuments();
        const completedPayments = await Payment.countDocuments({ status: 'completed' });
        const pendingPayments = await Payment.countDocuments({ status: 'pending' });
        const failedPayments = await Payment.countDocuments({ status: 'failed' });
        const refundedPayments = await Payment.countDocuments({ status: 'refunded' });

        const totalAmount = await Payment.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const paymentByMethod = await Payment.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: '$method', count: { $sum: 1 }, amount: { $sum: '$amount' } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalPayments,
                completedPayments,
                pendingPayments,
                failedPayments,
                refundedPayments,
                totalAmount: totalAmount[0]?.total || 0,
                paymentByMethod
            }
        });
    } catch (error) {
        console.error('Error fetching payment statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching payment statistics',
            error: error.message
        });
    }
});

export default router;
