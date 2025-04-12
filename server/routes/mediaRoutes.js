const express = require("express");
const multer = require("multer");
const { authenticateJWT } = require("../middleware/authMiddleware");
const {
    uploadMedia,
    getMediaByTrip,
    deleteMedia
} = require("../controllers/mediaController");

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });
router.post("/:tripId/media", authenticateJWT, upload.single("file"), uploadMedia);

router.get("/:tripId/media", authenticateJWT, getMediaByTrip);

router.delete("/:tripId/media/:mediaId", authenticateJWT, deleteMedia);

module.exports = router;
