import mongoose from "mongoose";

const uploadModel = new mongoose.Schema(
  {
    image: { type: Buffer, required: true },
    uploader: { type: mongoose.Types.ObjectId, required: true },
    tags: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

const Upload = mongoose.model("images", uploadModel);

export { Upload, uploadModel };
