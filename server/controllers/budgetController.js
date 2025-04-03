const pool = require('../database/db');

// Get budget details for a trip
exports.getBudget = async (req, res) => {
    try {
        const { tripId } = req.params;
        const result = await pool.query('SELECT * FROM budget WHERE trip_id = $1', [tripId]);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a budget entry for a trip
exports.addBudget = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { category, amount } = req.body;
        const result = await pool.query(
            'INSERT INTO budget (trip_id, category, amount) VALUES ($1, $2, $3) RETURNING *',
            [tripId, category, amount]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a budget entry
exports.updateBudget = async (req, res) => {
    try {
        const { tripId, budgetId } = req.params;
        const { category, amount } = req.body;
        const result = await pool.query(
            'UPDATE budget SET category = $1, amount = $2 WHERE budget_id = $3 AND trip_id = $4 RETURNING *',
            [category, amount, budgetId, tripId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Budget entry not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a budget entry
exports.deleteBudget = async (req, res) => {
    try {
        const { tripId, budgetId } = req.params;
        const result = await pool.query('DELETE FROM budget WHERE budget_id = $1 AND trip_id = $2 RETURNING *', [budgetId, tripId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Budget entry not found' });
        }
        res.status(200).json({ message: 'Budget entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
