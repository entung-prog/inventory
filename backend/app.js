require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require("./config/db.js");
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authMiddleware = require("./middleware/authMiddleware.js");

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Smart Inventory API" });
});

app.get("/dbtest", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");    
    res.json({ status: "ok", timestamp: result.rows[0] });
  } catch (err) {
    console.error("DB test error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Routes
app.use("/auth", authRoutes);
app.use("/users", authMiddleware, require("./routes/userRoutes"));
app.use("/items", itemRoutes);
app.use("/category", categoryRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});