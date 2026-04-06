const pool = require("../config/db");

// GET ALL USERS (admin only)
exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, role FROM users ORDER BY id DESC");
    res.json({ users: result.rows });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// GET USER BY ID (admin only)
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {  
    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id=$1",
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Get user by ID error:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// GET PROFILE (user sendiri)
exports.getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id=$1",
      [req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User profile not found" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// UPDATE ROLE (admin only)
exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  if (!role || !["user", "admin"].includes(role)) {
    return res.status(400).json({ error: "Invalid role. Must be 'user' or 'admin'" });
  }

  try {
    const result = await pool.query(
      "UPDATE users SET role=$1 WHERE id=$2 RETURNING id, name, email, role",
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Role updated successfully", user: result.rows[0] });
  } catch (err) {
    console.error("Update role error:", err);
    res.status(500).json({ error: "Failed to update role" });
  }
};

// DELETE USER (admin only)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const result = await pool.query("DELETE FROM users WHERE id=$1", [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
};