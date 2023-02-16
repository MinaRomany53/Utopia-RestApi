const app = require("./app");

app.listen(process.env.PORT, () => {
  console.log(` http://localhost:5000/api/v1/users`);
});
