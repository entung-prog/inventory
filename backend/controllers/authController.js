const pool = require("../config/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try { 
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Register failed");
  }
};

// LOGIN (INI YANG KAMU TANYA)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    const user = result.rows[0];
    if (!user) return res.status(400).send("User not found");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).send("Wrong password");

    const token = jwt.sign(
      { id: user.id, role: user.role },
      "SECRET_KEY",
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Login failed");
  }
};