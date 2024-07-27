import mongoose from "mongoose";

const uploadModel = new mongoose.Schema(
  {
    image: { type: "Buffer", required: true },
    uploader: { type: [mongoose.Schema.Types.ObjectId], required: true },
    tags: { type: "string" },
  },
  { timestamps: true, versionKey: false }
);

const Upload = mongoose.model("images", uploadModel);

export { Upload, uploadModel };
