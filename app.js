const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv").config({ path: "./config.env" }); // Get all env var in this file & save it

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
  res.status(404).json({
    status: "Fail",
    date: req.date,
    message: `Can't find ${req.originalUrl} in this server!`,
  });
});

module.exports = app;
