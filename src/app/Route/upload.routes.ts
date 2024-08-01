import { Router, Request, Response } from "express";
import { UploadController } from "../Upload";
const router = Router();
import { raw } from "body-parser";
import { heimdall } from "../middleware";

const use = (fn: any) => (req: Request, res: Response, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post(
  "/:tags",
  raw({ type: ["image/jpeg", "image/png"], limit: "15mb" }),
  heimdall,
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
