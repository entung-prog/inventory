const pool = require("../config/db.js");

// CREATE
exports.createItem = async (req, res) => {
  const { name, description, stock, category_id } = req.body;

  // Validate input
  if (!name || !category_id || stock === undefined) {
    return res.status(400).json({ 
      error: "name, stock, and category_id are required" 
    });
  }

  if (typeof stock !== "number" || stock < 0) {
    return res.status(400).json({ error: "stock must be a positive number" });
  }

  if (isNaN(category_id)) {
    return res.status(400).json({ error: "category_id must be a valid number" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO items (name, description, stock, category_id, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, description || null, stock, category_id, req.user.id]
    );

    res.status(201).json({ message: "Item created successfully", item: result.rows[0] });
  } catch (err) {
    console.error("Create item error:", err);
    
    if (err.code === "23503") {
      return res.status(400).json({ error: "Invalid category_id" });
    }
    
    res.status(500).json({ error: "Failed to create item" });
  }
};

// GET ALL
exports.getItems = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM items ORDER BY id DESC"
    );
    res.json({ items: result.rows, total: result.rows.length });
  } catch (err) {
    console.error("Get items error:", err);
    res.status(500).json({ error: "Failed to fetch items" });
  }
};

// GET BY ID
exports.getItemById = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid item ID" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM items WHERE id=$1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Get item by ID error:", err);
    res.status(500).json({ error: "Failed to fetch item" });
  }
};

// UPDATE
exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, stock, category_id } = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid item ID" });
  }

  // Validate input
  if (stock !== undefined && (typeof stock !== "number" || stock < 0)) {
    return res.status(400).json({ error: "stock must be a positive number" });
  }

  if (category_id !== undefined && isNaN(category_id)) {
    return res.status(400).json({ error: "category_id must be a valid number" });
  }

  try {
    const result = await pool.query(
      "UPDATE items SET name=COALESCE($1, name), description=COALESCE($2, description), stock=COALESCE($3, stock), category_id=COALESCE($4, category_id) WHERE id=$5 RETURNING *",
      [name || null, description || null, stock !== undefined ? stock : null, category_id || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ message: "Item updated successfully", item: result.rows[0] });
  } catch (err) {
    console.error("Update item error:", err);
    
    if (err.code === "23503") {
      return res.status(400).json({ error: "Invalid category_id" });
    }
    
    res.status(500).json({ error: "Failed to update item" });
  }
};

// DELETE
exports.deleteItem = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid item ID" });
  }

  try {
    const result = await pool.query("DELETE FROM items WHERE id=$1", [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Delete item error:", err);
    res.status(500).json({ error: "Failed to delete item" });
  }
};