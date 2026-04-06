const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// semua route butuh login
router.use(authMiddleware);

// user sendiri - MUST be before /:id route
router.get("/me", userController.getProfile);

// admin only
router.get("/", adminMiddleware, userController.getUsers);
//admin only
router.get("/:id", adminMiddleware, userController.getUserById);


// admin only
router.put("/:id/role", adminMiddleware, userController.updateUserRole);

// admin only
router.delete("/:id", adminMiddleware, userController.deleteUser);

module.exports = router;

