const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// semua route pakai auth
router.use(authMiddleware); 

// Admin only - create, update, delete
router.post("/", adminMiddleware, categoryController.createCategory);
router.get("/", categoryController.getCategory);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id", adminMiddleware, categoryController.updateCategory);
router.delete("/:id", adminMiddleware, categoryController.deleteCategory);

module.exports = router;