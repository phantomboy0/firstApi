import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    password: { type: String, required: true, select: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String },
    isBlocked: { type: Boolean, required: true },
    avatar: {
      type: mongoose.Schema.Types.ObjectId,
      default: "66a53b54534b7a1a60f5f4ed",
      required: true,
    },
    accessToken: { type: String, select: false },
    refreshToken: { type: String },
    role: {type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("users", userSchema);
