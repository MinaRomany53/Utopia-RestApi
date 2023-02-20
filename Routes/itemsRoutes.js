const express = require("express");
const itemsController = require("../Controllers/itemsController");

const router = express.Router();

router
  .route("/")
  .get(itemsController.getAllItems)
  .post(itemsController.addNewItem);

router
  .route("/:itemId")
  .get(itemsController.getItem)
  .patch(itemsController.updateItem)
  .delete(itemsController.deleteItem);

module.exports = router;
