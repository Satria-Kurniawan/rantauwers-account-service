const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT || 6001;
const connectToDatabase = require("./config/database");
const { errorHandler } = require("./middlewares/errorHandler");
const { userQueuePublishUser } = require("./messageBroker/userQueue");

connectToDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Account service is ready!");
});

app.use("/api/account", require("./routes/accountRoutes"));

// Message Broker triger event
userQueuePublishUser();
//

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Account Service ready on port ${port}`);
});
