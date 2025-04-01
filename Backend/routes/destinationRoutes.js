const express = require('express');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { addDestination, getDestinations, deleteDestination } = require('../controllers/destinationController');


const router = express.Router();

router.get("/:tripId/destinations", authenticateJWT, getDestinations);
router.post("/:tripId/destinations", authenticateJWT, addDestination);
router.put("/:tripId/destinations/:destinationId", authenticateJWT, deleteDestination);

module.exports = router;