import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String },
    isBlocked: { type: Boolean, required: true },
}, { timestamps: true, versionKey: false });
export default mongoose.model("users", userSchema);
//# sourceMappingURL=user.model.js.map