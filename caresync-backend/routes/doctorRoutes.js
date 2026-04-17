import express from 'express';
import Doctor from '../models/Doctor.js';
import { protect, hospitalAdminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @desc    Get all doctors FOR A SPECIFIC HOSPITAL (Used by both Patients to view, and Hospital Admins)
 * @route   GET /api/doctors/hospital/:hospitalId
 * @access  Private (Logged in Users)
 */
router.get('/hospital/:hospitalId', protect, async (req, res) => {
    try {
        const doctors = await Doctor.find({ hospital: req.params.hospitalId });
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctors' });
    }
});

/**
 * @desc    Create a new doctor (ONLY the Hospital Admin for that specific hospital can do this)
 * @route   POST /api/doctors
 * @access  Private/HospitalAdmin
 */
router.post('/', protect, hospitalAdminOnly, async (req, res) => {
    try {
        if (req.user.role === 'PA Admin') {
            return res.status(403).json({ message: 'PA Admin cannot create doctors' });
        }

        const { name, specialty, status } = req.body;
        
        // Critical Security: We force the doctor's hospital to equal the logged-in Hospital Admin's hospitalId
        // This ensures Admin A cannot create a doctor inside Admin B's hospital.
        const doctor = await Doctor.create({
            name,
            specialty,
            hospital: req.user.hospitalId, 
            status: status || 'Active'
        });

        res.status(201).json(doctor);
    } catch (error) {
        res.status(400).json({ message: 'Invalid doctor data', error: error.message });
    }
});

/**
 * @desc    Update a doctor (e.g., mark On Call)
 * @route   PUT /api/doctors/:id
 * @access  Private/HospitalAdmin
 */
router.put('/:id', protect, hospitalAdminOnly, async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Security Validation: Ensure the hospital admin actually owns this doctor before editing
        if (req.user.role !== 'Web Admin') {
            if (!req.user.hospitalId || doctor.hospital.toString() !== req.user.hospitalId.toString()) {
                return res.status(403).json({ message: 'Not authorized to edit this doctor' });
            }
        }

        if (req.user.role === 'PA Admin') {
            if (!req.user.doctorId || doctor._id.toString() !== req.user.doctorId.toString()) {
                return res.status(403).json({ message: 'Not authorized to edit this specific doctor schedule' });
            }
        }

        if (req.body.weeklySchedule) {
            doctor.set('weeklySchedule', req.body.weeklySchedule);
        }
        if (req.body.dutyStatus) {
            doctor.dutyStatus = req.body.dutyStatus;
        }
        if (req.body.status) {
            doctor.status = req.body.status;
        }
        
        const updatedDoctor = await doctor.save();

        res.json(updatedDoctor);
    } catch (error) {
        res.status(500).json({ message: 'Error updating doctor: ' + error.message });
    }
});

/**
 * @desc    Delete a doctor
 * @route   DELETE /api/doctors/:id
 * @access  Private/HospitalAdmin
 */
router.delete('/:id', protect, hospitalAdminOnly, async (req, res) => {
    try {
        if (req.user.role === 'PA Admin') {
            return res.status(403).json({ message: 'PA Admin cannot delete doctors' });
        }

        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Security Validation: Ensure the hospital admin owns this doctor
        if (doctor.hospital.toString() !== req.user.hospitalId.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this doctor' });
        }

        await doctor.deleteOne();
        res.json({ message: 'Doctor removed' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting doctor' });
    }
});

/**
 * @desc    Get ALL doctors across the network (For Patients to view global schedule)
 * @route   GET /api/doctors/all
 * @access  Private 
 */
router.get('/all', protect, async (req, res) => {
    try {
        const doctors = await Doctor.find().populate('hospital', 'name city');
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching global doctors schema' });
    }
});

/**
 * @desc    Get single doctor by ID
 * @route   GET /api/doctors/:id
 * @access  Private 
 */
router.get('/:id', protect, async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate('hospital', 'name city');
        if (doctor) {
            res.json(doctor);
        } else {
            res.status(404).json({ message: 'Doctor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctor' });
    }
});

export default router;
