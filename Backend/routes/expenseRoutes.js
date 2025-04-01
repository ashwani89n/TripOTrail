const express = require("express");
const { authenticateJWT } = require("../middleware/authMiddleware");
const {
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense
} = require("../controllers/expenseController");

const router = express.Router();
router.post("/:tripId/expenses", authenticateJWT, addExpense);
router.get("/:tripId/expenses", authenticateJWT, getExpenses);
router.put("/:tripId/expenses/:expenseId", authenticateJWT, updateExpense);
router.delete("/:tripId/expenses/:expenseId", authenticateJWT, deleteExpense);

module.exports = router;
