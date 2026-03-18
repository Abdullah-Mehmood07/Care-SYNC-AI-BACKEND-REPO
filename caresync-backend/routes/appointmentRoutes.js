import express from 'express';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { protect, hospitalAdminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @desc    Patient Books an Appointment
 * @route   POST /api/appointments
 * @access  Private (Patients only ideally, but we'll accept protect)
 */
router.post('/', protect, async (req, res) => {
    try {
        const { doctorId, hospitalId, date, timeSlot } = req.body;
        
        // Ensure only Patients book appointments
        if (req.user.role !== 'Patient') {
            return res.status(403).json({ message: 'Only Patients can book appointments' });
        }

        const appointment = await Appointment.create({
            patientId: req.user._id,
            patientGhid: req.user.ghid,
            doctorId,
            hospitalId,
            date,
            timeSlot,
            status: 'Pending'
        });

        res.status(201).json(appointment);
    } catch (error) {
        res.status(400).json({ message: 'Invalid appointment data', error: error.message });
    }
});

/**
 * @desc    Patient views their own upcoming appointments
 * @route   GET /api/appointments/my-appointments
 * @access  Private
 */
router.get('/my-appointments', protect, async (req, res) => {
    try {
        // Find appointments for the logged-in user, populate doctor and hospital names
        const appointments = await Appointment.find({ patientId: req.user._id })
            .populate('doctorId', 'name specialty')
            .populate('hospitalId', 'name city');
            
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments' });
    }
});

/**
 * @desc    Hospital Admin views all appointments for their specific hospital
 * @route   GET /api/appointments/hospital
 * @access  Private/HospitalAdmin
 */
router.get('/hospital', protect, hospitalAdminOnly, async (req, res) => {
    try {
        // Fetch all appointments linked ONLY to the logged-in admin's hospital
        const appointments = await Appointment.find({ hospitalId: req.user.hospitalId })
            .populate('doctorId', 'name specialty')
            .populate('patientId', 'email'); // Or grab any other user details we added
            
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching hospital appointments' });
    }
});

// Update appointment status (Admin only)
router.put('/:id/status', protect, hospitalAdminOnly, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        
        // Security Check
        if (appointment.hospitalId.toString() !== req.user.hospitalId.toString()) {
            return res.status(403).json({ message: 'Not authorized for this hospital' });
        }

        appointment.status = req.body.status;
        await appointment.save();
        
        res.json(appointment);
    } catch (error) {
        res.status(400).json({ message: 'Error updating appointment' });
    }
});

export default router;
