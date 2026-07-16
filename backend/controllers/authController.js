const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const generateToken = (id, username, role) => {
    return jwt.sign({ id, username, role }, process.env.JWT_SECRET || 'supersecretjwtkey_12345', {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    const { username, password, name, usn, phone_number, department } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await db.query(
            'INSERT INTO users (username, password, name, usn, phone_number, department) VALUES (?, ?, ?, ?, ?, ?)', 
            [username, hashedPassword, name || null, usn || null, phone_number || null, department || null]
        );

        if (result.insertId) {
            res.status(201).json({
                id: result.insertId,
                username,
                role: 'user',
                token: generateToken(result.insertId, username, 'user')
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                id: user.id,
                username: user.username,
                role: user.role,
                token: generateToken(user.id, user.username, user.role)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserProfile = async (req, res) => {
    res.json(req.user);
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile
};
