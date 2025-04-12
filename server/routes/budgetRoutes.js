const express = require('express');
const { authenticateJWT } = require("../middleware/authMiddleware");
const { getBudget, createBudget, addBudget } = require('../controllers/budgetController');
const router = express.Router();
router.post("/:tripId/budgets", authenticateJWT, addBudget);
router.get("/:tripId/budgets", authenticateJWT, getBudget);
module.exports = router;

// const express = require("express");
// const { authenticateJWT } = require("../middleware/authMiddleware");
// const {
//     addExpense,
//     getExpenses,
//     updateExpense,
//     deleteExpense
// } = require("../controllers/expenseController");

// const router = express.Router();
// router.post("/:tripId/expenses", authenticateJWT, addExpense);
// router.get("/:tripId/expenses", authenticateJWT, getExpenses);
// router.put("/:tripId/expenses/:expenseId", authenticateJWT, updateExpense);
// router.delete("/:tripId/expenses/:expenseId", authenticateJWT, deleteExpense);

// module.exports = router;
