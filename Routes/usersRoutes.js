const express = require("express");
const usersController = require("../Controllers/usersController");
const authController = require("../Controllers/authController");

const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);

router.route("/").get(authController.protect, usersController.getAllUsers);
router
  .route("/:userId")
  .get(authController.protect, usersController.getUser)
  .patch(authController.protect, usersController.updateUser)
  .delete(authController.protect, usersController.deleteUser);

module.exports = router;
