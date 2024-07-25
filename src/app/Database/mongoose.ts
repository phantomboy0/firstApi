import mongoose from "mongoose";
const dbConnection = mongoose.connection;
dbConnection.on("error", console.error.bind(console, "connection error"));
dbConnection.once("open", () => {
  console.log("connected to mangoDB");
});

export default mongoose;
