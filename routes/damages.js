const express = require("express");
const router = express.Router();
const db = require('../config/db');

// GET damages
router.get("/", (req, res) => {
  const sql = `
    SELECT damages.*, rentals.customer_id, rentals.vehicle_id
    FROM damages
    JOIN rentals ON damages.rental_id = rentals.id
    ORDER BY damages.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// ADD damage
router.post("/", (req, res) => {
  const { rental_id, description, penalty_amount, reported_date } = req.body;

  const insertSql = `
    INSERT INTO damages (rental_id, description, penalty_amount, reported_date)
    VALUES (?, ?, ?, ?)
  `;

  db.query(insertSql, [rental_id, description, penalty_amount, reported_date], (err) => {
    if (err) return res.status(500).json(err);

    // get existing payment
    db.query(
      "SELECT amount FROM payments WHERE rental_id = ?",
      [rental_id],
      (selectErr, results) => {
        if (selectErr) return res.status(500).json(selectErr);

        const currentAmount = results.length > 0 ? results[0].amount : 0;
        const newAmount = currentAmount + Number(penalty_amount);

        // update payment
        db.query(
          "UPDATE payments SET amount = ? WHERE rental_id = ?",
          [newAmount, rental_id],
          (updateErr) => {
            if (updateErr) return res.status(500).json(updateErr);

            res.json({ message: "Damage report added successfully" });
          }
        );
      }
    );
  });
});

module.exports = router;