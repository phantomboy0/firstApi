import mongoose from "mongoose";

const userRoles: Array<string> = ["CLIENT", "MANAGER", "MODERATOR", "ADMIN"];

const sessionDataSchema = new mongoose.Schema(
  {
    role: { type: String, enum: userRoles, default: userRoles[0] },
    device: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
    modifyDate: { type: String, default: Date.now() },
  },
  { _id: false }
);

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
    },
    roles: [{ type: String, enum: userRoles, default: userRoles[0] }],
    sessions: [{ type: sessionDataSchema }],
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("users", userSchema);
