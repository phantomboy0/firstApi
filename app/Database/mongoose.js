const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/firstApi");
const dbConnection = mongoose.connection;
dbConnection.on("error", console.log.bind(console, "connection error"));
dbConnection.once("open", (callback) => {
  console.log("connected to mangoDB");
});

module.exports = mongoose;
