const mongoose = require("mongoose");
const slugify = require("slugify");

// Create Item Schema
const itemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  description: { type: String, required: true, trim: true },
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
  this.find({ closed: { $ne: true } }); // not showing any secret tours
  this.projection({ closed: 0 }); // not showing any secret tours
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
