const express = require("express");
const router = express.Router();
const db = require('../config/db');

router.get("/summary", (req, res) => {
  const queries = {
    customers: "SELECT COUNT(*) AS count FROM customers",
    vehicles: "SELECT COUNT(*) AS count FROM vehicles",
    rentals: "SELECT COUNT(*) AS count FROM rentals",
    activeRentals: "SELECT COUNT(*) AS count FROM rentals WHERE rental_status IN ('Pending','Booked','Active')",
    unpaidPayments: "SELECT COUNT(*) AS count FROM payments WHERE status = 'Pending'"
  };

  const result = {};
  let completed = 0;
  const total = Object.keys(queries).length;

  Object.keys(queries).forEach((key) => {
    db.query(queries[key], (err, rows) => {
      if (err) return res.status(500).json(err);

      result[key] = rows[0].count;
      completed++;

      if (completed === total) {
        res.json(result);
      }
    });
  });
});

module.exports = router;