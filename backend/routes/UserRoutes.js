const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserControllers");

router.post("/", UserController.addUser);
router.get("/:id", UserController.getById);
router.put("/:id", UserController.updateUser); // Update user
router.delete("/:id", UserController.deleteUser); // Delete user
router.post("/login", UserController.loginUser);

module.exports = router;
