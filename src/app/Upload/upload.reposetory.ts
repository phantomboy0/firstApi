import { Upload } from "./upload.model";
import { uploadModel } from "./types";

class UploadReposetory {
  upload: any;
  constructor(Upload: any) {
    this.upload = Upload;
  }

  createNewImage = async (image: uploadModel) => {
    return await new this.upload(image).save();
  };

  getImage = async (_id: string) => await this.upload.findById(_id);
  deleteImage = async (_id: string) => await this.upload.findByIdAndDelete(_id);
}
export { UploadReposetory };
export default new UploadReposetory(Upload);
