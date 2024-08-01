import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { UserController } from "../User";
import { heimdall } from "../middleware";
const router = Router();
const use = (fn: Function) => (req: Request, res: Response, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/", use(UserController.RegisterUser.bind(UserController)));

router.get(
  "/:_id",

  use(UserController.FindUserById.bind(UserController))
);
router.get("/", heimdall("USER"), use(UserController.FindMe.bind(UserController)));

router.post("/login", use(UserController.Login.bind(UserController)));

router.delete("/:_id", use(UserController.DeleteUserById.bind(UserController)));

router.patch("/:_id", use(UserController.UpdateUserById.bind(UserController)));

export const UserRoutes = router;
