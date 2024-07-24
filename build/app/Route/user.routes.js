"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const mongoose = require("mongoose");
const { ResponseHandler } = require("../handlers");
const { UserController } = require("../User");
const router = express.Router();
const use = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
router.post("/", use(UserController.RegisterUser.bind(UserController)));
router.get("/:_id", use(UserController.FindUserById.bind(UserController)));
router.delete("/:_id", use(UserController.DeleteUserById.bind(UserController)));
router.patch("/:_id", use(UserController.UpdateUserById.bind(UserController)));
module.exports = router;
//# sourceMappingURL=user.routes.js.map