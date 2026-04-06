const express = require("express");
const router = express.Router();

const itemController = require("../controllers/itemController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// semua route pakai auth
router.use(authMiddleware);

// Admin only - create and delete
router.post("/", adminMiddleware, itemController.createItem);
router.get("/", itemController.getItems);
router.get("/:id", itemController.getItemById);
router.put("/:id", adminMiddleware, itemController.updateItem);
router.delete("/:id", adminMiddleware, itemController.deleteItem);

module.exports = router;