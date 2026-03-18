import express from 'express';
import Hospital from '../models/Hospital.js';
import City from '../models/City.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Fetch all hospitals
// @route   GET /api/hospitals
// @access  Public (so patients can see available hospitals)
router.get('/', async (req, res) => {
    try {
        // Populate the city field so we get the city name along with the hospital
        const hospitals = await Hospital.find({}).populate('city', 'name');
        res.json(hospitals);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching hospitals' });
    }
});

// @desc    Create a hospital
// @route   POST /api/hospitals
// @access  Private/Web Admin
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const { name, city, status } = req.body; // 'city' should be the ObjectId of the specific city

        // Verify city exists before creating hospital
        const cityExists = await City.findById(city);
        if (!cityExists) {
            return res.status(404).json({ message: 'City not found. Cannot add hospital here.' });
        }

        const hospital = await Hospital.create({
            name,
            city,
            status: status || 'Active'
        });

        // Return hospital with populated city for immediate UI display
        const populatedHospital = await Hospital.findById(hospital._id).populate('city', 'name');
        res.status(201).json(populatedHospital);
    } catch (error) {
        res.status(400).json({ message: 'Invalid hospital data' });
    }
});

// @desc    Update a hospital status
// @route   PUT /api/hospitals/:id
// @access  Private/Web Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id);

        if (hospital) {
            hospital.status = req.body.status || hospital.status;
            // Additional fields can be updated here if needed in the future

            const updatedHospital = await hospital.save();
            const populatedUpdatedHospital = await Hospital.findById(updatedHospital._id).populate('city', 'name');
            res.json(populatedUpdatedHospital);
        } else {
            res.status(404).json({ message: 'Hospital not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error updating hospital' });
    }
});

// @desc    Delete a hospital
// @route   DELETE /api/hospitals/:id
// @access  Private/Web Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const hospital = await Hospital.findByIdAndDelete(req.params.id);
        if (hospital) {
            res.json({ message: 'Hospital removed successfully' });
        } else {
            res.status(404).json({ message: 'Hospital not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error deleting hospital' });
    }
});

export default router;
