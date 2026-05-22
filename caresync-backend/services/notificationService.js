import Notification from '../models/Notification.js';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

export const createNotification = async (userId, title, message, type, deliveryMethod = 'in_app') => {
    try {
        const notification = new Notification({
            userId,
            title,
            message,
            type,
            deliveryMethod,
            deliveryStatus: 'sent'
        });
        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

export const sendAppointmentReminder = async (appointmentId) => {
    try {
        const appointment = await Appointment.findById(appointmentId)
            .populate('patientId')
            .populate('doctorId');

        if (!appointment) {
            throw new Error('Appointment not found');
        }

        const notification = new Notification({
            userId: appointment.patientId._id,
            title: 'Appointment Reminder',
            message: `You have an appointment with ${appointment.doctorId.name} on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.timeSlot}`,
            type: 'appointment',
            relatedId: appointmentId,
            relatedModel: 'Appointment',
            deliveryMethod: 'all',
            deliveryStatus: 'sent'
        });

        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error sending appointment reminder:', error);
        throw error;
    }
};

export const sendMessageNotification = async (messageId, senderId, recipientId, message) => {
    try {
        const notification = new Notification({
            userId: recipientId,
            title: 'New Message',
            message: message || 'You have received a new message',
            type: 'message',
            relatedId: messageId,
            relatedModel: 'Message',
            deliveryMethod: 'in_app',
            deliveryStatus: 'sent'
        });

        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error sending message notification:', error);
        throw error;
    }
};

export const getNotifications = async (userId, page = 1, limit = 20) => {
    try {
        const skip = (page - 1) * limit;

        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Notification.countDocuments({ userId });

        return {
            notifications,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

export const markAsRead = async (notificationId) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { read: true },
            { new: true }
        );

        if (!notification) {
            throw new Error('Notification not found');
        }

        return notification;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};

export const markAllAsRead = async (userId) => {
    try {
        const result = await Notification.updateMany(
            { userId, read: false },
            { read: true }
        );

        return result;
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        throw error;
    }
};

export const deleteNotification = async (notificationId) => {
    try {
        const notification = await Notification.findByIdAndDelete(notificationId);

        if (!notification) {
            throw new Error('Notification not found');
        }

        return notification;
    } catch (error) {
        console.error('Error deleting notification:', error);
        throw error;
    }
};

export const getUnreadCount = async (userId) => {
    try {
        const count = await Notification.countDocuments({
            userId,
            read: false
        });

        return count;
    } catch (error) {
        console.error('Error getting unread count:', error);
        throw error;
    }
};

export const getNotificationStats = async (userId) => {
    try {
        const total = await Notification.countDocuments({ userId });
        const unread = await Notification.countDocuments({ userId, read: false });
        const byType = await Notification.aggregate([
            { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);

        return {
            total,
            unread,
            read: total - unread,
            byType
        };
    } catch (error) {
        console.error('Error getting notification stats:', error);
        throw error;
    }
};
