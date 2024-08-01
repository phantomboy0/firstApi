import { UserRoutes } from "./user.routes";
import { UploadRoutes } from "./upload.routes";
import { Router, Request, Response } from "express";
import ResponseHandler from "../handlers";

const router = Router();

router.use("/user", UserRoutes);
router.use("/upload", UploadRoutes);

router.get("/", (req: Request, res: Response) => {
  ResponseHandler.send({ res, statusCode: 200, returnObj: "OK" });
});
export const Routes = router;
