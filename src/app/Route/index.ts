const UserRoutes = require("./user.routes");
const express = require("express");
const router = express.Router();
const { ResponseHandler } = require("../handlers");
import { Request, Response } from "express";

router.use("/user", UserRoutes);

router.get("/", (req: Request, res: Response) => {
  return ResponseHandler.send({ res, statusCode: 200, returnObj: "OK" });
});

module.exports = router;
