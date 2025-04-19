const express = require("express");
const { authenticateJWT } = require("../middleware/authMiddleware");
const {
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense,
    getExpensesSettle
} = require("../controllers/expenseController");

const router = express.Router();
router.post("/:tripId/expenses", authenticateJWT, addExpense);
router.get("/:tripId/expenses", authenticateJWT, getExpenses);
router.put("/:tripId/expenses/:expenseId", authenticateJWT, updateExpense);
router.delete("/:tripId/expenses/:expenseId", authenticateJWT, deleteExpense);
router.get("/:tripId/who-owes-whom", authenticateJWT, getExpensesSettle);

module.exports = router;
