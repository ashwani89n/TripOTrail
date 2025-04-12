const express = require('express');
const { getTripmates, createTripmate } = require('../controllers/tripmateController');
const router = express.Router();
router.get('/', getTripmates);
router.post('/', createTripmate);
module.exports = router;