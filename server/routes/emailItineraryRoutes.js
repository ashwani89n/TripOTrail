const express = require("express");
const { authenticateJWT } = require("../middleware/authMiddleware");
const {
    sendItinerary
} = require("../controllers/emailItineraryController");

console.log("inside routes");

const router = express.Router();
router.post("/:tripId/send-itinerary", authenticateJWT, sendItinerary);
module.exports = router;
