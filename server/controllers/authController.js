const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../database/db');

// Register a new user
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, name, email',
            [name, email, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505' && error.constraint === 'users_email_key') {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ error: error.message });
    }
};

// User login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) return res.status(400).json({ message: 'User not found' });

        const isValid = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!isValid) return res.status(400).json({ message: 'Invalid credentials' });
        const expiresInSeconds = 3 * 60 * 60; // 3 hours
        const token = jwt.sign({ id: user.rows[0].user_id }, process.env.JWT_SECRET, { expiresIn: expiresInSeconds });
        const token_expiry = Date.now() + expiresInSeconds * 1000;
        res.json({ token, token_expiry, user: { id: user.rows[0].user_id, name: user.rows[0].name, email: user.rows[0].email } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
