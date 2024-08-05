import { Router, Request, Response } from "express";
import { role } from "../User/types";
import { UserController } from "../User";
import { heimdall, razvan } from "../middleware";
const router = Router();
const use = (fn: Function) => (req: Request, res: Response, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/", use(UserController.RegisterUser.bind(UserController)));

router.get(
  "/:_id",
  heimdall,
  razvan(["CLIENT"]),
  use(UserController.FindUserById.bind(UserController))
);

router.get("/", heimdall, use(UserController.FindMe.bind(UserController)));

router.post("/login", use(UserController.Login.bind(UserController)));

router.delete(
  "/:_id",
  heimdall,
  use(UserController.DeleteUserById.bind(UserController))
);

router.patch(
  "/:_id",
  heimdall,
  use(UserController.UpdateUserById.bind(UserController))
);

export const UserRoutes = router;
