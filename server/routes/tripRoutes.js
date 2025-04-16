const express = require('express');
const { getTrips, createTrip, getTripById, deleteTrip, updateTrip } = require('../controllers/tripController');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', authenticateJWT, getTrips);
router.post('/', authenticateJWT, createTrip);
router.get('/:tripId', authenticateJWT,getTripById);
router.patch('/:tripId', authenticateJWT,deleteTrip);

// Update a trip
router.put("/:tripId", authenticateJWT, updateTrip);
module.exports = router;