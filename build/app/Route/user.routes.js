import { Router } from "express";
import { UserController } from "../User";
const router = Router();
const use = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
router.post("/", use(UserController.RegisterUser.bind(UserController)));
router.get("/:_id", use(UserController.FindUserById.bind(UserController)));
router.delete("/:_id", use(UserController.DeleteUserById.bind(UserController)));
router.patch("/:_id", use(UserController.UpdateUserById.bind(UserController)));
export const UserRoutes = router;
//# sourceMappingURL=user.routes.js.map