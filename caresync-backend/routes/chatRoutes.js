import express from 'express';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @desc    Send a new message
 * @route   POST /api/chats
 * @access  Private 
 */
router.post('/', protect, async (req, res) => {
    try {
        const { patientId, doctorId, text } = req.body;
        
        let determinedSenderRole = 'Patient';
        if (req.user.role === 'PA Admin' || req.user.role === 'Doctor' || req.user.role === 'Hospital Admin') {
             determinedSenderRole = 'Doctor';
        }

        const message = await Message.create({
            patientId,
            doctorId,
            senderRole: determinedSenderRole,
            text
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ message: 'Error sending message', error: error.message });
    }
});

/**
 * @desc    Get chat thread between a specific patient and doctor
 * @route   GET /api/chats/:patientId/:doctorId
 * @access  Private
 */
router.get('/:patientId/:doctorId', protect, async (req, res) => {
    try {
        const messages = await Message.find({
            patientId: req.params.patientId,
            doctorId: req.params.doctorId
        }).sort({ timestamp: 1 });
        
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chat thread' });
    }
});

/**
 * @desc    Get all chat threads for a doctor (grouped/distinct patients)
 * @route   GET /api/chats/doctor/:doctorId/patients
 * @access  Private (For PA Admin)
 */
router.get('/doctor/:doctorId/patients', protect, async (req, res) => {
    try {
        // Find distinct patient IDs who have messaged this doctor
        const patientIds = await Message.distinct('patientId', { doctorId: req.params.doctorId });
        
        // We'd ideally populate patient details, doing it manually:
        const patients = await User.find({ _id: { $in: patientIds } }).select('name email');
        
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chatting patients' });
    }
});

export default router;
