const mongoose = require("mongoose");
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// 🟢 Connect to Hosted Database from Atlas Cloud
mongoose.set("strictQuery", true); // strict schemas & store in DB only what specified in the model
mongoose
  .connect(DB)
  .then(() => console.log("Database connection successful ✅"))
  .catch((err) => {
    console.error("Database connection error ❌");
    next(err);
  });

app.listen(process.env.PORT, () => {
  console.log(` http://localhost:5000/api/v1/users`);
});
