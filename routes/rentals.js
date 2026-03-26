const express = require('express');
const router = express.Router();
const db = require('../config/db');



// CREATE rental
router.post('/', (req, res) => {
    const {
        first_name, last_name, age, phone,
        address, license_number,
        vehicle_id, pickup_datetime, drop_datetime
    } = req.body;

    if (!age || age < 18) {
        return res.status(400).json({ error: "Customer must be at least 18" });
    }

    // calculate hours
    const start = new Date(pickup_datetime);
    const end = new Date(drop_datetime);

    if (!pickup_datetime || !drop_datetime) {
        return res.status(400).json({ error: "Invalid dates" });
    }
    

    // get vehicle price
    db.query('SELECT price_per_hour FROM vehicles WHERE id = ?', [vehicle_id], (err, result) => {
        if (err) return res.status(500).json(err);

        if (!result || result.length === 0) {
            return res.status(404).json({ error: "Vehicle not found" });
        }
        const price = result[0].price_per_hour;
        const total_cost = price * hours; 

        // insert customer first
        db.query(
            `INSERT INTO customers 
            (first_name, last_name, age, phone, address, license_number)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [first_name, last_name, age, phone, address, license_number],
            (err, custResult) => {

                if (err) return res.status(500).json(err);

                const customer_id = custResult.insertId;

                // insert rental
                db.query(
                    `INSERT INTO rentals 
                    (customer_id, vehicle_id, first_name, last_name, age, customer_phone, address, license_number,
                    pickup_datetime, drop_datetime, total_hours, total_cost, payment_status, rental_status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', 'Active')`,
                    [customer_id, vehicle_id, first_name, last_name, age, phone, address, license_number,
                        pickup_datetime, drop_datetime, hours, total_cost],
                    (err) => {

                        if (err) return res.status(500).json(err);

                        // update vehicle status
                        db.query(
                            'UPDATE vehicles SET status = "Rented" WHERE id = ?',
                            [vehicle_id]
                        );

                        res.json({ message: 'Rental created', total_cost });
                    }
                );
            }
        );
    });
});



// GET rentals
router.get('/', (req, res) => {
    db.query(`
        SELECT r.*, v.vehicle_name 
        FROM rentals r
        JOIN vehicles v ON r.vehicle_id = v.id
    `, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

module.exports = router;