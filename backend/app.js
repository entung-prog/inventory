require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require("./config/db.js");
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authMiddleware = require("./middleware/authMiddleware.js");

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to Smart Inventory API");
});

app.get("/dbtest", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB error");
  }
});

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use("/auth", authRoutes);
app.use("/users", authMiddleware, require("./routes/userRoutes"));
app.use("/items", itemRoutes);
app.use("/category", categoryRoutes);


// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});