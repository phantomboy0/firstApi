import { Request, Response } from "express";
import UploadService from "./upload.service";
import ResponseHandler from "../handlers";
import { responseHandler } from "../handlers/types";
import { uploadService } from "./types";
import { Schema, Types } from "mongoose";
import { RequestExtended } from "../types";

class UploadController {
  uploadService: uploadService;
  responseHandler: responseHandler;
  constructor(UploadService: uploadService, ResponseHandler: responseHandler) {
    this.uploadService = UploadService;
    this.responseHandler = ResponseHandler;
  }

  createNewImage = async (req: RequestExtended, res: Response) => {
    try {
      if (!(await this.uploadService.checkUploader(req._id)))
        return this.responseHandler.send({
          res,
          statusCode: 403,
          returnObj: "such user doesn't exist or can't upload",
        });

      const result = await this.uploadService.createNewImage({
        image: req.body,
        uploader: req._id,
        tags: req.params.tags,
      });

      if (result) {
        if (req.params.tags === "avatar")
          await this.uploadService.setNewAvatar(req._id, {
            avatar: result._id,
          });

        return this.responseHandler.send({
          res,
          statusCode: 200,
          returnObj: {
            _id: result._id,
            uploader: result.uploader,
            tags: result.tags,
          },
        });
      } else
        return this.responseHandler.send({
          res,
          statusCode: 404,
          returnObj: result,
        });
    } catch (error: any) {
      return this.responseHandler.send({
        res,
        statusCode: 500,
        returnObj: error.message,
      });
    }
  };

  getImage = async (req: Request, res: Response) => {
    try {
      const result = await this.uploadService.getImage(
        //@ts-ignore
        new Types.ObjectId(req.params._id)
      );

      if (result) {
        var data = result.image;
        var img = Buffer.from(data, "base64");

        res.writeHead(200, {
          "Content-Type": "image/png",
          "Content-Length": img.length,
        });

        // ! this res can't use responseHandler, WHY?
        res.end(img);
        //return this.responseHandler.send({ res, statusCode: 200, returnObj: img });
      } else
        return this.responseHandler.send({
          res,
          statusCode: 404,
          returnObj: "no file found with this _id",
        });
    } catch (error: any) {
      return this.responseHandler.send({
        res,
        statusCode: 500,
        returnObj: error.message,
      });
    }
  };

  getImageData = async (req: Request, res: Response) => {
    try {
      const result = await this.uploadService.getImage(
        //@ts-ignores
        new Types.ObjectId(req.params._id)
      );

      if (result)
        return this.responseHandler.send({
          res,
          statusCode: 200,
          returnObj: {
            uploader: result.uploader,
            tags: result.tags,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
          },
        });
      else
        return this.responseHandler.send({
          res,
          statusCode: 404,
          returnObj: "no file found with this _id",
        });
    } catch (error: any) {
      return this.responseHandler.send({
        res,
        statusCode: 500,
        returnObj: error.message,
      });
    }
  };

  deleteImage = async (req: RequestExtended, res: Response) => {
    try {
      const imageData = await this.uploadService.getImage(
        //@ts-ignores
        new Types.ObjectId(req.params._id)
      );

      if (req.roles !== "ADMIN")
        if (!new Types.ObjectId(req._id).equals(imageData.uploader))
          return this.responseHandler.send({
            res,
            statusCode: 403,
            returnObj: "you can't delete other's image",
          });

      const result = await this.uploadService.deleteImage(
        //@ts-ignore
        new Types.ObjectId(req.params._id)
      );

      if (result)
        return this.responseHandler.send({
          res,
          statusCode: 200,
          returnObj: "Deleted",
        });
      else
        return this.responseHandler.send({
          res,
          statusCode: 404,
          returnObj: "no file found with this _id",
        });
    } catch (error: any) {
      return this.responseHandler.send({
        res,
        statusCode: 500,
        returnObj: error.message,
      });
    }
  };
}

export default new UploadController(UploadService, ResponseHandler);
