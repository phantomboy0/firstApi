import { UserRoutes } from "./user.routes";
import express from "express";
import { ResponseHandler } from "../handlers";
import { Request, Response } from "express";

const router = express.Router();

router.use("/user", UserRoutes);

router.get("/", (req: Request, res: Response) => {
  return ResponseHandler.send({ res, statusCode: 200, returnObj: "OK" });
});
export const Routes = router;
