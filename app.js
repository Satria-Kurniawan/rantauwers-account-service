const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT || 6001;
const connectToDatabase = require("./config/database");
const { errorHandler } = require("./middlewares/errorHandler");

connectToDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Account service is ready!");
});

app.use("/api/account", require("./routes/accountRoutes"));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Account Service ready on port ${port}`);
});
