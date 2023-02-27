const express = require("express");
const authController = require("../Controllers/authController");
const usersController = require("../Controllers/usersController");

const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);

router.route("/").get(usersController.getAllUsers);
router
  .route("/:userId")
  .get(usersController.getUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
