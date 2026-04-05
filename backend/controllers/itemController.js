const pool = require("../config/db.js");

// CREATE
exports.createItem = async (req, res) => {
  const { name, description, stock, category_id } = req.body;

  if (!category_id) {
    return res.status(400).send("category_id is required");
  }

  try {
    const result = await pool.query(
      "INSERT INTO items (name, description, stock, category_id, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, description, stock, category_id, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Create failed");
  }
};

// GET ALL
exports.getItems = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM items");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Fetch failed");
  }
};

// GET BY ID
exports.getItemById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM items WHERE id=$1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Item not found");
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Fetch by id failed");
  }
};

// UPDATE
exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, stock, category_id } = req.body;

  try {
    const result = await pool.query(
      "UPDATE items SET name=$1, description=$2, stock=$3, category_id=$4 WHERE id=$5 RETURNING *",
      [name, description, stock,  category_id, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Update failed");
  }
};

// DELETE
exports.deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM items WHERE id=$1", [id]);
    res.send("Deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Delete failed");
  }
};