const pool = require("../config/db");

// GET ALL USERS (admin only)
exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, role FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Fetch users failed");
  }
};
// GET USER BY ID (admin only)
exports.getUserById = async (req, res) => {
  const { id } = req.params;
    try {  
    const result = await pool.query(
        "SELECT id, name, email, role FROM users WHERE id=$1",
        [id]
    );
    if (result.rows.length === 0) {
        return res.status(404).send("User not found");
    }
    res.json(result.rows[0]);
    } catch (err) {
    console.error(err);
    res.status(500).send("Fetch user failed");
    }
};


// GET PROFILE (user sendiri)
exports.getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id=$1",
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Fetch profile failed");
  }
};

//create user (admin only)
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
    try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
        [name, email, hashedPassword, role]
    );
    res.json(result.rows[0]);
    } catch (err) {
    console.error(err);
    res.status(500).send("Create user failed");
    }
};

// UPDATE ROLE (admin only)
exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const result = await pool.query(
      "UPDATE users SET role=$1 WHERE id=$2 RETURNING id, name, email, role",
      [role, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Update role failed");
  }
};

// DELETE USER (admin only)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM users WHERE id=$1", [id]);
    res.send("User deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Delete user failed");
  }
};