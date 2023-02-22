const mongoose = require("mongoose");
const slugify = require("slugify");

// Create Item Schema
const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A tour must have a title"],
    trim: true,
    minLength: [8, "Minimum title length is 8 characters"],
    maxLength: [40, "Maximum title length is 40 characters"],
  },
  price: { type: Number, required: [true, "A tour must have a price"] },
  description: {
    type: String,
    required: [true, "A tour must have a description"],
    trim: true,
  },
  coverImg: { type: String, required: [true, "A tour must have an Image"] },
  imgs: { type: [String] },
  category: {
    type: String,
    required: [true, "You must choose one category"],
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
        "{VALUE} is not supported, You must choose category field from: Vehicles - Properties - Electronics - Furniture - Books - Services - Accessories - Other",
    },
  },
  address: { type: String, required: true, trim: true },
  createAt: { type: Date, default: Date.now },
  closed: { type: Boolean, default: false },
  slug: { type: String },

  //user
});

/* ------------------- Start Mongoose Middleware ------------------- */

// Document Middleware  -  runs before create() and save()
itemSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  this.title = this.title.replace(/  +/g, " ");
  next();
});

// Query Middleware  - runs before find()
itemSchema.pre(/^find/, function (next) {
  this.find({ closed: { $ne: true } }); // not showing any Closed Item
  next();
});

// Aggregation Middleware  - runs before aggregate() only
itemSchema.pre("aggregate", function (next) {
  const stage = { $match: { closed: { $ne: true } } };
  this.pipeline().unshift(stage); // add new stage at the first of aggregation pipeline array
  next();
});

/* ------------------- End Mongoose Middleware --------------------- */

// Create Item Model
const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
