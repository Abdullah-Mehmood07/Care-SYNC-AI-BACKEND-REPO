import express from 'express';
import City from '../models/City.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Fetch all cities
// @route   GET /api/cities
// @access  Public (so patients can see available cities)
router.get('/', async (req, res) => {
    try {
        const cities = await City.find({});
        res.json(cities);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching cities' });
    }
});

// @desc    Create a city
// @route   POST /api/cities
// @access  Private/Web Admin
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const { name } = req.body;
        
        const cityExists = await City.findOne({ name });
        if (cityExists) {
            return res.status(400).json({ message: 'City already exists' });
        }

        const city = await City.create({ name });
        res.status(201).json(city);
    } catch (error) {
        res.status(400).json({ message: 'Invalid city data' });
    }
});

// @desc    Delete a city
// @route   DELETE /api/cities/:id
// @access  Private/Web Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const city = await City.findByIdAndDelete(req.params.id);
        if (city) {
            res.json({ message: 'City removed successfully' });
        } else {
            res.status(404).json({ message: 'City not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error deleting city' });
    }
});

export default router;
