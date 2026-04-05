const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categorycontroller");
const authMiddleware = require("../middleware/authMiddleware");

// semua route pakai auth
router.use(authMiddleware); 

router.post("/", categoryController.createCategory);
router.get("/", categoryController.getCategory);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;