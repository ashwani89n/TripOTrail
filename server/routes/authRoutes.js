const express = require('express');
const multer = require("multer");
const { login, register } = require('../controllers/authController');
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
// router.post('/register', register);
router.post('/register', upload.single('file'), register);
router.post('/login', login);
module.exports = router;
