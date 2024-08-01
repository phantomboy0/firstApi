import { ObjectId } from "mongoose";

export type uploadModel = {
  image: any;
  uploader: ObjectId;
  tags: string;
};

import { UploadService as uploadService } from "./upload.service";
export { uploadService };

import { uploadModel } from "./upload.model";
export { uploadModel };

import { UploadReposetory as uploadReposetory } from "./upload.reposetory";
export { uploadReposetory };
