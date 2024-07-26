"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const user_routes_1 = require("./user.routes");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const handlers_1 = __importDefault(require("../handlers"));
router.use("/user", user_routes_1.UserRoutes);
router.get("/", (req, res) => {
    return handlers_1.default.send({ res, statusCode: 200, returnObj: "OK" });
});
exports.Routes = router;
//# sourceMappingURL=index.js.map