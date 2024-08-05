import mongoose from "mongoose";
import { UserController } from "../User";
const dbConnection = mongoose.connection;
dbConnection.on("error", console.error.bind(console, "connection error"));
dbConnection.once("open", () => {
  console.log("connected to mangoDB");
  UserController.createAdminAccountIfThereIsNone();
});

export default mongoose;
