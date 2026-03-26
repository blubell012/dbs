const express = require("express");
const router = express.Router();
const db = require('../config/db');

router.get("/", (req, res) => {
  const sql = `
    SELECT payments.*, 
           rentals.first_name, 
           rentals.last_name, 
           rentals.customer_phone, 
           vehicles.vehicle_name
    FROM payments
    JOIN rentals ON payments.rental_id = rentals.id
    JOIN vehicles ON rentals.vehicle_id = vehicles.id
    ORDER BY payments.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

module.exports = router;