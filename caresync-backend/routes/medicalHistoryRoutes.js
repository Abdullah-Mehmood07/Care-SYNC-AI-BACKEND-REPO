import express from 'express';
import { protect, hospitalAdminOnly } from '../middleware/authMiddleware.js';
import MedicalHistory from '../models/MedicalHistory.js';
import User from '../models/User.js';

const router = express.Router();

// @desc    Create medical history entry
// @route   POST /api/medical-history
// @access  Private/HospitalAdmin
router.post('/', protect, hospitalAdminOnly, async (req, res) => {
    try {
        const { patientId, visitDate, doctorId, hospitalId, diagnosis, treatment, medications, notes, followUpDate } = req.body;

        // Validation
        if (!patientId || !visitDate || !diagnosis) {
            return res.status(400).json({
                success: false,
                message: 'Please provide patientId, visitDate, and diagnosis'
            });
        }

        // Check if patient exists
        const patient = await User.findById(patientId);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        const medicalHistory = new MedicalHistory({
            patientId,
            visitDate,
            doctorId,
            hospitalId,
            diagnosis,
            treatment,
            medications: medications || [],
            notes,
            followUpDate
        });

        await medicalHistory.save();

        res.status(201).json({
            success: true,
            data: medicalHistory
        });
    } catch (error) {
        console.error('Error creating medical history:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating medical history',
            error: error.message
        });
    }
});

// @desc    Get medical history for a patient
// @route   GET /api/medical-history/patient/:patientId
// @access  Private
router.get('/patient/:patientId', protect, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Check authorization - patient can view own, doctors can view their patients
        if (req.user._id.toString() !== req.params.patientId && req.user.role !== 'Web Admin' && req.user.role !== 'Hospital Admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this patient\'s medical history'
            });
        }

        // Check if patient exists
        const patient = await User.findById(req.params.patientId);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        const medicalHistory = await MedicalHistory.find({ patientId: req.params.patientId })
            .populate('doctorId', 'name email')
            .populate('hospitalId', 'name')
            .sort({ visitDate: -1 })
            .skip(skip)
            .limit(limit);

        const total = await MedicalHistory.countDocuments({ patientId: req.params.patientId });

        res.status(200).json({
            success: true,
            data: medicalHistory,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching medical history:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching medical history',
            error: error.message
        });
    }
});

// @desc    Get single medical history entry
// @route   GET /api/medical-history/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const medicalHistory = await MedicalHistory.findById(req.params.id)
            .populate('patientId', 'name email ghid')
            .populate('doctorId', 'name email')
            .populate('hospitalId', 'name');

        if (!medicalHistory) {
            return res.status(404).json({
                success: false,
                message: 'Medical history entry not found'
            });
        }

        // Check authorization
        if (req.user._id.toString() !== medicalHistory.patientId._id.toString() && 
            req.user.role !== 'Web Admin' && 
            req.user.role !== 'Hospital Admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this medical history'
            });
        }

        res.status(200).json({
            success: true,
            data: medicalHistory
        });
    } catch (error) {
        console.error('Error fetching medical history entry:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching medical history entry',
            error: error.message
        });
    }
});

// @desc    Update medical history entry
// @route   PUT /api/medical-history/:id
// @access  Private/HospitalAdmin
router.put('/:id', protect, hospitalAdminOnly, async (req, res) => {
    try {
        let medicalHistory = await MedicalHistory.findById(req.params.id);

        if (!medicalHistory) {
            return res.status(404).json({
                success: false,
                message: 'Medical history entry not found'
            });
        }

        // Update allowed fields
        const allowedFields = ['visitDate', 'doctorId', 'hospitalId', 'diagnosis', 'treatment', 'medications', 'notes', 'followUpDate'];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                medicalHistory[field] = req.body[field];
            }
        });

        // Add attachment if provided
        if (req.body.attachment) {
            medicalHistory.attachments.push(req.body.attachment);
        }

        await medicalHistory.save();

        res.status(200).json({
            success: true,
            data: medicalHistory
        });
    } catch (error) {
        console.error('Error updating medical history:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating medical history',
            error: error.message
        });
    }
});

// @desc    Delete medical history entry
// @route   DELETE /api/medical-history/:id
// @access  Private/HospitalAdmin
router.delete('/:id', protect, hospitalAdminOnly, async (req, res) => {
    try {
        const medicalHistory = await MedicalHistory.findById(req.params.id);

        if (!medicalHistory) {
            return res.status(404).json({
                success: false,
                message: 'Medical history entry not found'
            });
        }

        await MedicalHistory.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Medical history entry deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting medical history:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting medical history',
            error: error.message
        });
    }
});

export default router;
