const db = require('./config/db');
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const authRoutes = require("./routes/auth");
const customerRoutes = require("./routes/customers");
const vehicleRoutes = require("./routes/vehicles");
const rentalRoutes = require("./routes/rentals");
const paymentRoutes = require("./routes/payments");
const damageRoutes = require("./routes/damages");
const dashboardRoutes = require("./routes/dashboard");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/damages", damageRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});