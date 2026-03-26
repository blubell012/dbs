const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all vehicles (grouped for UI)
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      vehicle_name AS name,
      COUNT(*) AS total,
      SUM(CASE WHEN status = 'Available' THEN 1 ELSE 0 END) AS available,
      price_per_hour,
      MIN(image_url) AS image
    FROM vehicles
    GROUP BY vehicle_name, price_per_hour
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


//admin-vehicles
router.get("/all", (req, res) => {
  const sql = `
    SELECT 
      id,
      vehicle_name AS name,
      model,
      registration_number,
      price_per_hour,
      status
    FROM vehicles
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

module.exports = router;