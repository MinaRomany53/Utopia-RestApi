const express = require("express");
const usersController = require("../Controllers/usersController");

const router = express.Router();

router
  .route("/")
  .get(usersController.getAllUsers)
  .post(usersController.addNewUser);

router
  .route("/:userId")
  .get(usersController.getUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
