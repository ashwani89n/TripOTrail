const pool = require("../database/db");

// exports.addExpense = async (req, res) => {
//     try {
//         const tripId = parseInt(req.params.tripId, 10);
//         if (!tripId || isNaN(tripId)) {
//             return res.status(400).json({ status: "error", message: "Invalid trip ID" });
//         }

//         const { category, amount, added_by_name, added_by_email, added_by_profile_picture, comments } = req.body;

//         const result = await pool.query(
//             `INSERT INTO expenses (trip_id, category, amount, added_by_name, added_by_email , added_by_profile_picture, comments)
//              VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
//             [tripId, category, amount, added_by_name, added_by_email, added_by_profile_picture, comments]
//         );

//         res.status(201).json({
//             status: "success",
//             expense: result.rows[0],
//             message: "Expense added successfully"
//         });

//     } catch (error) {
//         res.status(500).json({ status: "error", error: error.message });
//     }
// };

exports.addExpense = async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    if (!tripId || isNaN(tripId)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid trip ID" });
    }

    const {
      category,
      amount,
      added_by_name,
      added_by_email,
      added_by_profile_picture,
      comments,
    } = req.body;

    // 1. Insert into expenses table
    const expenseResult = await pool.query(
      `INSERT INTO expenses (trip_id, category, amount, added_by_name, added_by_email, added_by_profile_picture, comments) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        tripId,
        category,
        amount,
        added_by_name,
        added_by_email,
        added_by_profile_picture,
        comments,
      ]
    );

    const expense = expenseResult.rows[0]; // Add this line
    const { expense_id: expenseId } = expense;

    // 2. Get all tripmates
    const tripmatesResult = await pool.query(
      `SELECT email FROM tripmates WHERE trip_id = $1`,
      [tripId]
    );

    const tripmates = tripmatesResult.rows.map((row) => row.email);

    // 3. Filter out payer (added_by_email)
    const receivers = tripmates.filter((email) => email !== added_by_email);

    if (receivers.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No receivers to split with (payer is the only member).",
      });
    }

    // 4. Calculate split amount
    const splitAmount = parseFloat((amount / tripmates.length).toFixed(2));

    // 5. Insert into expense_splits table
    const splitPromises = receivers.map((receiverEmail) =>
      pool.query(
        `INSERT INTO expense_splits (expense_id, trip_id, payer_email, receiver_email, amount, is_settled) 
                 VALUES ($1, $2, $3, $4, $5, $6)`,
        [expenseId, tripId, added_by_email, receiverEmail, splitAmount, false]
      )
    );

    await Promise.all(splitPromises);

    res.status(201).json({
      status: "success",
      expense,
      message: "Expense added and split recorded successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: error.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    if (!tripId || isNaN(tripId)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid trip ID" });
    }

    const result = await pool.query(
      `SELECT expense_id, category, amount, added_by_name, added_by_profile_picture, comments, created_at 
             FROM expenses WHERE trip_id = $1 ORDER BY created_at DESC`,
      [tripId]
    );

    res.status(200).json({
      status: "success",
      expenses: result.rows,
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
      return res
        .status(400)
        .json({ status: "error", message: "Invalid trip ID or expense ID" });
    }

    const {
      category,
      amount,
      added_by_name,
      added_by_profile_picture,
      comments,
    } = req.body;

    const result = await pool.query(
      `UPDATE expenses 
             SET category = $1, amount = $2, added_by_name = $3, added_by_profile_picture = $4, comments = $5 
             WHERE expense_id = $6 AND trip_id = $7 RETURNING *`,
      [
        category,
        amount,
        added_by_name,
        added_by_profile_picture,
        comments,
        expenseId,
        tripId,
      ]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Expense not found" });
    }

    res.status(200).json({
      status: "success",
      expense: result.rows[0],
      message: "Expense updated successfully",
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
      return res
        .status(400)
        .json({ status: "error", message: "Invalid trip ID or expense ID" });
    }

    const result = await pool.query(
      `DELETE FROM expenses WHERE expense_id = $1 AND trip_id = $2 RETURNING *`,
      [expenseId, tripId]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Expense not found" });
    }

    res
      .status(200)
      .json({ status: "success", message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

exports.getExpensesSettle = async (req, res) => {
  const { tripId } = req.params;

  try {
    const query = `
      SELECT 
  tm.name AS tripmate_name,
  tm.email AS tripmate_email,
  tm.profile_picture AS tripmate_picture,
  e.expense_id,
  e.category,
  e.amount AS total_amount,
  e.comments,
  e.created_at,
  e.added_by_name,
  e.added_by_email,
  e.added_by_profile_picture,
  COALESCE(SUM(CASE WHEN es.payer_email = tm.email THEN es.amount ELSE 0 END), 0) AS lent_amount,
  COALESCE(SUM(CASE WHEN es.receiver_email = tm.email THEN es.amount ELSE 0 END), 0) AS borrowed_amount,
  MAX(CASE WHEN es.receiver_email = tm.email THEN es.is_settled::int ELSE 0 END) > 0 AS is_settled
FROM tripmates tm
CROSS JOIN expenses e
LEFT JOIN expense_splits es 
  ON es.expense_id = e.expense_id AND es.trip_id = $1 
  AND (es.payer_email = tm.email OR es.receiver_email = tm.email)
WHERE tm.trip_id = $1 AND e.trip_id = $1
GROUP BY 
  tm.name, tm.email, tm.profile_picture,
  e.expense_id, e.category, e.amount, e.comments, e.created_at,
  e.added_by_name, e.added_by_email, e.added_by_profile_picture
ORDER BY e.created_at;
    `;

    const { rows } = await pool.query(query, [tripId]);

    // Group by tripmate
    const result = {};
    rows.forEach((row) => {
      const email = row.tripmate_email;
      if (!result[email]) {
        result[email] = {
          name: row.tripmate_name,
          email: row.tripmate_email,
          profile_picture: row.tripmate_picture,
          expenses: [],
        };
      }

      result[email].expenses.push({
        expense_id: row.expense_id,
        category: row.category,
        total_amount: parseFloat(row.total_amount),
        comment: row.comments,
        dayDate: row.created_at, 
        added_by: {
          name: row.added_by_name,
          email: row.added_by_email,
          profile_picture: row.added_by_profile_picture
        },
        lent: parseFloat(row.lent_amount),
        borrowed: parseFloat(row.borrowed_amount),
        is_settled: row.is_settled
      });
      
    });

    res.json(Object.values(result));
  } catch (error) {
    console.error("Error fetching expense-wise splits:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.settleExpense = async (req, res) => {
    const { tripId } = req.params;
    const { payer_email, receiver_email} = req.body;

  
    try {
      const query = `
        UPDATE expense_splits
    SET is_settled = TRUE
    WHERE trip_id = $1 AND (
      (payer_email = $2 AND receiver_email = $3) OR
      (payer_email = $3 AND receiver_email = $2)
    )
      `;
  
      await pool.query(query, [tripId, payer_email, receiver_email]);
  
      res.json({ message: "Expense settled successfully." });
    } catch (error) {
      console.error("Error settling expense:", error);
      res.status(500).json({ error: "Failed to settle expense." });
    }
  };
  