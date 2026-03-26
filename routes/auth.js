const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (err, results) => {
            if (err) return res.status(500).json(err);

            if (results.length > 0) {
                res.json({ success: true });
            } else {
                res.json({ success: false });
            }
        }
    );
});

module.exports = router;