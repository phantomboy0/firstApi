const express = require("express");
const mongoose = require("mongoose");
const { ResponseHandler } = require("../handlers");
const { UserController } = require("../User");
import { Request, Response } from "express";

const router = express.Router();
const use = (fn: Function) => (req: Request, res: Response, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/", use(UserController.RegisterUser.bind(UserController)));

router.get("/:_id", use(UserController.FindUserById.bind(UserController)));

router.delete("/:_id", use(UserController.DeleteUserById.bind(UserController)));

router.patch("/:_id", use(UserController.UpdateUserById.bind(UserController)));

module.exports = router;
