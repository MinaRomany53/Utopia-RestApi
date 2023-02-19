const mongoose = require("mongoose");

// Create Item Schema
const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  coverImg: { type: String, required: true },
  imgs: { type: [String] },
  category: {
    type: String,
    required: true,
    enum: {
      values: [
        "Vehicles",
        "Properties",
        "Electronics",
        "Furniture",
        "Books",
        "Services",
        "Accessories",
        "Other",
      ],
      message:
        "{VALUE} is not supported, You must choose category field from: Vehicles - Properties -    Electronics - Furniture - Books - Services - Accessories - Other",
    },
  },
  address: { type: String, required: true },
  createAt: { type: Date, default: Date.now },
  closed: { type: Boolean, default: false },

  //user
});

// Create Item Model
const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
