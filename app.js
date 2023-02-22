const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv").config({ path: "./config.env" }); // Get all env var in this file & save it
const ApiErrors = require("./Utils/apiErrors");

const usersRouter = require("./Routes/usersRoutes");
const itemsRouter = require("./Routes/itemsRoutes");

const app = express();

// BuiltIn Middleware - For parsing application/json
app.use(express.json());

// Third Party Middleware - Logging Http Requests
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Application Level Middleware (My Code)
app.use((req, res, next) => {
  const date = new Date().toISOString();
  req.date = date;
  next();
});

// Router-Level Middleware
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/items", itemsRouter);

// Handling Unhandled Routes
app.all("*", (req, res, next) => {
  next(new ApiErrors(404, `Can't find ${req.originalUrl} in this server!`)); // next(err)
});

// Error-Handling Middleware - Handling All Errors in the App
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.message = err.message || "Something Wrong happen";

  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === "production") {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      console.error("Error🔥❌", err);
      res.status(500).json({
        status: err.status,
        message: "Something Wrong happen",
      });
    }
  }
});

module.exports = app;
