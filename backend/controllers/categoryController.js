const pool = require("../config/db.js");

// CREATE
exports.createCategory = async (req, res) => {
  const { name } = req.body;
  
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Category name is required" });
  }

  try {   
    const result = await pool.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING *",
      [name.trim()]
    );  
    res.status(201).json({ message: "Category created successfully", category: result.rows[0] });
  } catch (err) {
    console.error("Create category error:", err);
    
    if (err.code === "23505") {
      return res.status(409).json({ error: "Category name already exists" });
    }
    
    res.status(500).json({ error: "Failed to create category" });
  }
};

// GET ALL
exports.getCategory = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories ORDER BY id DESC");
    res.json({ categories: result.rows, total: result.rows.length });
  } catch (err) {
    console.error("Get categories error:", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// GET BY ID
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid category ID" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM categories WHERE id=$1",
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }   
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Get category by ID error:", err);
    res.status(500).json({ error: "Failed to fetch category" });
  }
};

// UPDATE
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid category ID" });
  }
  
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Category name is required" });
  }

  try {
    const result = await pool.query(
      "UPDATE categories SET name=$1 WHERE id=$2 RETURNING *",
      [name.trim(), id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    res.json({ message: "Category updated successfully", category: result.rows[0] });
  } catch (err) {
    console.error("Update category error:", err);
    
    if (err.code === "23505") {
      return res.status(409).json({ error: "Category name already exists" });
    }
    
    res.status(500).json({ error: "Failed to update category" });
  }
};

// DELETE
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid category ID" });
  }

  try {
    const result = await pool.query(
      "DELETE FROM categories WHERE id=$1 RETURNING *",
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    } 
    
    res.json({ message: "Category deleted successfully", category: result.rows[0] });
  } catch (err) {
    console.error("Delete category error:", err);
    res.status(500).json({ error: "Failed to delete category" });
  }
};
