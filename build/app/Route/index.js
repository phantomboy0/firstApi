import { UserRoutes } from "./user.routes";
import { UploadRoutes } from "./upload.routes";
import { Router } from "express";
import ResponseHandler from "../handlers";
const router = Router();
router.use("/user", UserRoutes);
router.use("/upload", UploadRoutes);
router.get("/", (req, res) => {
    return ResponseHandler.send({ res, statusCode: 200, returnObj: "OK" });
});
export const Routes = router;
//# sourceMappingURL=index.js.map