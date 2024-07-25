import mongoose from "mongoose";

export interface userModel {
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  isBlocked: boolean;
}

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String },
    isBlocked: { type: Boolean, required: true },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("users", userSchema);
