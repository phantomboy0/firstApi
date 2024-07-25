"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../User"));
const router = express_1.default.Router();
const use = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
router.post("/", use(User_1.default.RegisterUser.bind(User_1.default)));
router.get("/:_id", use(User_1.default.FindUserById.bind(User_1.default)));
router.delete("/:_id", use(User_1.default.DeleteUserById.bind(User_1.default)));
router.patch("/:_id", use(User_1.default.UpdateUserById.bind(User_1.default)));
exports.UserRoutes = router;
//# sourceMappingURL=user.routes.js.map