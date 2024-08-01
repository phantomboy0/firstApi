import { Upload } from "./upload.model";
import { uploadModel } from "./types";
import { ObjectId } from "mongoose";

class UploadReposetory {
  upload: any;
  constructor(Upload: any) {
    this.upload = Upload;
  }

  createNewImage = async (image: uploadModel) =>
    await new this.upload(image).save();

  getImage = async (_id: ObjectId) => await this.upload.findById(_id);
  deleteImage = async (_id: ObjectId) =>
    await this.upload.findByIdAndDelete(_id);
}
export { UploadReposetory };
export default new UploadReposetory(Upload);
