import { uploadModel } from "./types";
import UploadReposetory from "./upload.reposetory";
import { UserService } from "../User";
import { uploadReposetory } from "./types";
import { userService } from "../User/types";
import { ObjectId } from "mongoose";

class UploadService {
  uploadReposetory: uploadReposetory;
  userService: userService;
  constructor(UploadReposetory: uploadReposetory, UserService: userService) {
    this.uploadReposetory = UploadReposetory;
    this.userService = UserService;
  }
  createNewImage = async (image: uploadModel) => {
    return await this.uploadReposetory.createNewImage(image);
  };

  getImage = async (_id: ObjectId) => await this.uploadReposetory.getImage(_id);
  deleteImage = async (_id: ObjectId) =>
    await this.uploadReposetory.deleteImage(_id);
  checkUploader = async (_id: ObjectId) => {
    return await this.userService.getUser(_id);
  };
  setNewAvatar = async (_id: ObjectId, avatar: any) => {
    await this.userService.updateUser(_id, avatar);
  };
}
export { UploadService };
export default new UploadService(UploadReposetory, UserService);
