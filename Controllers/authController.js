const User = require("../Models/userModel");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const ApiErrors = require("../Utils/apiErrors");

exports.signup = async (req, res, next) => {
  try {
    // Create New User in Database - only tihs fields is allowed to recieved from user in the body
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      phone: req.body.phone,
      photo: req.body.photo,
    });
    newUser.password = undefined; // not showing it in the response
    newUser.active = undefined;
    newUser.role = undefined;
    newUser.__v = undefined;
    newUser.joinAt = undefined;

    // Create new unique JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_PRIVATE_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Send JWT with Cookie to the Browser

    // Send Response
    res.status(201).json({
      status: "Success",
      date: req.date,
      token: token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    // Check User Credentials First
    const { email, password } = req.body;

    if (!password || !email)
      return next(new ApiErrors(400, "Email and Password Required!"));

    const account = await User.findOne({ email: email }).select("+password");
    if (!account) return next(new ApiErrors(401, "Sorry ,user not found!")); // Unauthorized!!

    const checkPassword = await bcrypt.compare(password, account.password);
    if (!checkPassword)
      return next(new ApiErrors(401, "Sorry ,email or password is incorrect!")); // Unauthorized!!

    // Congratulations now we can Create new unique JWT as a passport to this user
    const token = jwt.sign({ id: account._id }, process.env.JWT_PRIVATE_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Send JWT with Cookie to the Browser

    // return Logged User Info Without the Password
    account.password = undefined;
    account.active = undefined;
    account.role = undefined;
    account.__v = undefined;
    account.joinAt = undefined;

    // Send Response
    res.status(200).json({
      status: "Success",
      date: req.date,
      token: token,
      data: {
        account: account,
      },
    });
  } catch (err) {
    next(err);
  }
};
