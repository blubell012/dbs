const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all customers
router.get('/', (req, res) => {
    db.query('SELECT * FROM customers', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// ADD customer
router.post('/', (req, res) => {
    const { first_name, last_name, age, phone, address, license_number } = req.body;

    // basic validation (important)
    if (!first_name || !phone) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = `
        INSERT INTO customers 
        (first_name, last_name, age, phone, address, license_number)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [first_name, last_name, age, phone, address, license_number], (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({
            message: 'Customer added',
            customer_id: result.insertId
        });
    });
});

module.exports = router;