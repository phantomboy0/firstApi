import { UserRoutes } from "./user.routes";
import express from "express";
const router = express.Router();
import { ResponseHandler } from "../handlers";
import { Request, Response } from "express";

router.use("/user", UserRoutes);

router.get("/", (req: Request, res: Response) => {
  return ResponseHandler.send({ res, statusCode: 200, returnObj: "OK" });
});
export const Routes = router;
