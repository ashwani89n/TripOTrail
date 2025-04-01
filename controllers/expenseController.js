const pool = require("../database/db");

exports.addExpense = async (req, res) => {
    try {
        const tripId = parseInt(req.params.tripId, 10);
        if (!tripId || isNaN(tripId)) {
            return res.status(400).json({ status: "error", message: "Invalid trip ID" });
        }

        const { category, amount, added_by_name, added_by_profile_picture, comments } = req.body;

        const result = await pool.query(
            `INSERT INTO expenses (trip_id, category, amount, added_by_name, added_by_profile_picture, comments) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [tripId, category, amount, added_by_name, added_by_profile_picture, comments]
        );

        res.status(201).json({
            status: "success",
            expense: result.rows[0],
            message: "Expense added successfully"
        });

    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const tripId = parseInt(req.params.tripId, 10);
        if (!tripId || isNaN(tripId)) {
            return res.status(400).json({ status: "error", message: "Invalid trip ID" });
        }

        const result = await pool.query(
            `SELECT expense_id, category, amount, added_by_name, added_by_profile_picture, comments, created_at 
             FROM expenses WHERE trip_id = $1 ORDER BY created_at DESC`,
            [tripId]
        );

        res.status(200).json({
            status: "success",
            expenses: result.rows
        });

    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
};

exports.updateExpense = async (req, res) => {
    try {
        const tripId = parseInt(req.params.tripId, 10);
        const expenseId = parseInt(req.params.expenseId, 10);

        if (!tripId || isNaN(tripId) || !expenseId || isNaN(expenseId)) {
            return res.status(400).json({ status: "error", message: "Invalid trip ID or expense ID" });
        }

        const { category, amount, added_by_name, added_by_profile_picture, comments } = req.body;

        const result = await pool.query(
            `UPDATE expenses 
             SET category = $1, amount = $2, added_by_name = $3, added_by_profile_picture = $4, comments = $5 
             WHERE expense_id = $6 AND trip_id = $7 RETURNING *`,
            [category, amount, added_by_name, added_by_profile_picture, comments, expenseId, tripId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ status: "error", message: "Expense not found" });
        }

        res.status(200).json({
            status: "success",
            expense: result.rows[0],
            message: "Expense updated successfully"
        });

    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
};


exports.deleteExpense = async (req, res) => {
    try {
        const tripId = parseInt(req.params.tripId, 10);
        const expenseId = parseInt(req.params.expenseId, 10);

        if (!tripId || isNaN(tripId) || !expenseId || isNaN(expenseId)) {
            return res.status(400).json({ status: "error", message: "Invalid trip ID or expense ID" });
        }

        const result = await pool.query(
            `DELETE FROM expenses WHERE expense_id = $1 AND trip_id = $2 RETURNING *`,
            [expenseId, tripId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ status: "error", message: "Expense not found" });
        }

        res.status(200).json({ status: "success", message: "Expense deleted successfully" });

    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
};
