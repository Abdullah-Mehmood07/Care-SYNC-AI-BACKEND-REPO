import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import Notification from '../models/Notification.js';
import * as notificationService from '../services/notificationService.js';

const router = express.Router();

// @desc    Get all notifications for user
// @route   GET /api/notifications
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const result = await notificationService.getNotifications(req.user._id, page, limit);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching notifications',
            error: error.message
        });
    }
});

// @desc    Get notification stats for user
// @route   GET /api/notifications/stats
// @access  Private
router.get('/stats/dashboard', protect, async (req, res) => {
    try {
        const unreadCount = await notificationService.getUnreadCount(req.user._id);
        const total = await Notification.countDocuments({ userId: req.user._id });

        res.status(200).json({
            success: true,
            data: {
                total,
                unread: unreadCount,
                read: total - unreadCount
            }
        });
    } catch (error) {
        console.error('Error fetching notification stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching notification stats',
            error: error.message
        });
    }
});

// @desc    Get single notification
// @route   GET /api/notifications/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        // Check ownership
        if (notification.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this notification'
            });
        }

        res.status(200).json({
            success: true,
            data: notification
        });
    } catch (error) {
        console.error('Error fetching notification:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching notification',
            error: error.message
        });
    }
});

// @desc    Create notification (Admin only)
// @route   POST /api/notifications
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const { userId, title, message, type, deliveryMethod } = req.body;

        // Validation
        if (!userId || !title || !message || !type) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: userId, title, message, type'
            });
        }

        const notification = await notificationService.createNotification(
            userId,
            title,
            message,
            type,
            deliveryMethod
        );

        res.status(201).json({
            success: true,
            data: notification
        });
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating notification',
            error: error.message
        });
    }
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        // Check ownership
        if (notification.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this notification'
            });
        }

        const updatedNotification = await notificationService.markAsRead(req.params.id);

        res.status(200).json({
            success: true,
            data: updatedNotification
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking notification as read',
            error: error.message
        });
    }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
router.put('/read-all/all', protect, async (req, res) => {
    try {
        const result = await notificationService.markAllAsRead(req.user._id);

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read',
            data: result
        });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking all notifications as read',
            error: error.message
        });
    }
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        // Check ownership
        if (notification.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this notification'
            });
        }

        await notificationService.deleteNotification(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting notification',
            error: error.message
        });
    }
});

export default router;
