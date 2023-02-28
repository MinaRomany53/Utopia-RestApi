const express = require("express");
const itemsController = require("../Controllers/itemsController");
const authController = require("../Controllers/authController");

const router = express.Router();

router
  .route("/Category-Stats")
  .get(authController.protect, itemsController.getCategoryStats);

router
  .route("/")
  .get(itemsController.getAllItems)
  .post(authController.protect, itemsController.addNewItem);

router
  .route("/:itemId")
  .get(authController.protect, itemsController.getItem)
  .patch(authController.protect, itemsController.updateItem)
  .delete(authController.protect, itemsController.deleteItem);

module.exports = router;
