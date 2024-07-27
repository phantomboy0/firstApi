import { Router, Request, Response } from "express";
import UploadController from "../Upload/upload.controller";
const router = Router();
import { raw } from "body-parser";

const use = (fn: any) => (req: Request, res: Response, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post(
  "/:tags/:_id",
  raw({ type: ["image/jpeg", "image/png"], limit: "5mb" }),
  use(UploadController.createNewImage.bind(UploadController))
);

router.get("/:_id", use(UploadController.getImage.bind(UploadController)));

router.get(
  "/:_id/data",
  use(UploadController.getImageData.bind(UploadController))
);

router.delete(
  "/:_id",
  use(UploadController.deleteImage.bind(UploadController))
);

export const UploadRoutes = router;
