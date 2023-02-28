const User = require("../Models/userModel");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const ApiErrors = require("../Utils/apiErrors");
const { promisify } = require("util");

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
    if (!account) return next(new ApiErrors(401, "Sorry ,user not found!"));

    const checkPassword = await bcrypt.compare(password, account.password);
    if (!checkPassword)
      return next(new ApiErrors(401, "Sorry ,email or password is incorrect!"));

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

exports.protect = async (req, res, next) => {
  try {
    // Check if Token exist first
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return next(new ApiErrors(401, "Please Login First!"));

    // Verify this Token
    const decodeToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_PRIVATE_KEY
    );

    // Check if user still exist
    const currentUser = await User.findById(decodeToken.id);
    if (!currentUser)
      return next(new ApiErrors(401, "This User no longer exist!"));

    // Check if user change password after sending this Token
    if (currentUser.passwordChangeAt) {
      const tokenIssuedAt = decodeToken.iat; // seconds
      const passChangedAt = currentUser.passwordChangeAt.getTime() / 1000; // seconds
      if (tokenIssuedAt < passChangedAt) {
        return next(
          new ApiErrors(
            401,
            "This User change his Password, Please Login Again!"
          )
        );
      }
    }

    // Move to next middleware to get the protected route
    req.currentUser = currentUser; // use it to access Role of current user - next middleware
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError")
      err.message = "Invalid Token, Please Login Again!";
    if (err.name === "TokenExpiredError")
      err.message = "Your Token Expired, Please Login Again!";
    err.statusCode = 401;
    next(err);
  }
};

exports.restrictTo = async (req, res, next) => {};
