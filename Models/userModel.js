const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "your name is required!"],
    trim: true,
    minLength: [4, "At least 4 characters!"],
    maxLength: [20, "At most 20 characters!"],
    validate: {
      validator: function (value) {
        return /^[ a-zA-Z]+$/g.test(value);
      },
      message: "Only alphabets Allowed",
    },
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Your email is required!"],
    trim: true,
    validate: {
      validator: function (email) {
        return validator.isEmail(email);
      },
      message: (e) => `${e.value} is not a valid email!`,
    },
  },
  phone: {
    type: String,
    required: [true, "Phone Number is required!"],
    trim: true,
    minLength: [11, "Enter a valid number!"],
    validate: {
      validator: function (number) {
        return validator.isMobilePhone(number);
      },
      message: "Not a valid Phone number!",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
    minLength: [8, "Password must contains at least 8 characters!"],
    select: false, // Not showing this field in any query
  },
  passwordConfirm: {
    type: String,
    required: [true, "password must entered again"],
    validate: {
      validator: function (value) {
        return this.password === value;
      },
      message: "Password Don't Match!",
    },
  },
  role: {
    type: String,
    enum: {
      values: ["user", "admin"],
      message:
        "{VALUE} is not supported, You must choose Role from: user - admin ",
    },
    default: "user",
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  photo: { type: String },
  joinAt: { type: Date, default: Date.now },
  passwordChangeAt: { type: Date },
});

/* ------------------- Start Mongoose Middleware ------------------- */

// Document Middleware  -  runs before create() and save()

// Query Middleware  - runs before find()

// Aggregation Middleware  - runs before aggregate() only

/* ------------------- End Mongoose Middleware --------------------- */

// Create User Model
const User = mongoose.model("User", userSchema);
module.exports = User;
