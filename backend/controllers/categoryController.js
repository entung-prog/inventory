const pool = require("../config/db.js");

// CREATE
exports.createCategory = async (req, res) => {
  const { name } = req.body;
    try {   
    const result = await pool.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING *",
      [name]
    );  
    res.json(result.rows[0]);
    } catch (err) {
    console.error(err);
    res.status(500).send("Create failed");
    }
};

// GET ALL
exports.getCategory = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Fetch failed");
  }
};

// GET BY ID
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;    
    try {
    const result = await pool.query(
        "SELECT * FROM categories WHERE id=$1",
        [id]
    );
    if (result.rows.length === 0) {
        return res.status(404).send("Category not found");
    }   
    res.json(result.rows[0]);
    } catch (err) {
    console.error(err);
    res.status(500).send("Fetch by id failed");
    }
}

// UPDATE
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
    const result = await pool.query(
        "UPDATE categories SET name=$1 WHERE id=$2 RETURNING *",
        [name, id]
    );
    if (result.rows.length === 0) {
        return res.status(404).send("Category not found");
    }
    res.json(result.rows[0]);
    } catch (err) {
    console.error(err);
    res.status(500).send("Update failed");
    }
};

// DELETE
exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
    const result = await pool.query(
        "DELETE FROM categories WHERE id=$1 RETURNING *",
        [id]
    );
    if (result.rows.length === 0) {
        return res.status(404).send("Category not found");
    } 
    res.json(result.rows[0]);
    } catch (err) {
    console.error(err);
    res.status(500).send("Delete failed");
    }
};
