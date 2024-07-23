const express = require("express");
const mongoose = require("mongoose");
const { ResponseHandler } = require("../handlers");
const { UserController } = require("../User");

const router = express.Router();
const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post(
  "/register-user",
  use(UserController.RegisterUser.bind(UserController))
);

router.get("/get-user", use(UserController.FindUserById.bind(UserController)));

router.get(
  "/get-user/:id",
  use(UserController.FindUserByIdWithParams.bind(UserController))
);

router.delete(
  "/delete-user",
  use(UserController.DeleteUserById.bind(UserController))
);

router.patch(
  "/update-user",
  use(UserController.UpdateUserById.bind(UserController))
);

module.exports = router;
