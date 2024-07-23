const UserRoutes = require("./user.routes");
const express = require("express");
const router = express.Router();
const { ResponseHandler } = require("../handlers");

router.use("/user", UserRoutes);

router.get("/", (req, res) => {
  return ResponseHandler.send({ res, statusCode: 200, returnObj: "OK" });
});

module.exports = router;
