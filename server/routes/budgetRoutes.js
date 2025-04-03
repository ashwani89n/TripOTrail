const express = require('express');
const { getBudget, createBudget } = require('../controllers/budgetController');
const router = express.Router();
router.get('/', getBudget);
router.post('/', createBudget);
module.exports = router;