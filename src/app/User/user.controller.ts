import UserModel from "./user.model";
import { ResponseHandler } from "../handlers";
import UserService from "./user.service";
import { Request, Response } from "express";

class UserController {
  userModel: any;
  responseHandler: any;
  userService: any;

  constructor({
    UserModel,
    ResponseHandler,
    UserService,
  }: {
    UserModel: any;
    ResponseHandler: any;
    UserService: any;
  }) {
    this.userModel = UserModel;
    this.responseHandler = ResponseHandler;
    this.userService = UserService;
  }

  RegisterUser = async (req: Request, res: Response) => {
    try {
      if (!this.userService.isPhoneNumberValid(req.body.phoneNumber))
        return this.responseHandler.send({
          res,
          statusCode: 409,
          returnObj: "phone number should formatted like 09xxxxxxxxx",
        });

      if (await this.userService.isPhoneNumberExist(req.body.phoneNumber))
        return this.responseHandler.send({
          res,
          statusCode: 409,
          returnObj: "a user with this fucked phone number exist",
        });

      const newUser = new this.userModel(req.body);
      try {
        await this.userService.createUser(newUser);
        return this.responseHandler.send({
          res,
          statusCode: 201,
          returnObj: newUser,
        });
      } catch (error: any) {
        return this.responseHandler.send({
          res,
          statusCode: 400,
          returnObj: { error: error.message },
        });
      }
    } catch (error: any) {
      return this.responseHandler.send({
        res,
        statusCode: 500,
        returnObj: { error: error.message },
      });
    }
  };

  FindUserById = async (req: Request, res: Response) => {
    try {
      const result = await this.userService.getUser(req.params._id);

      if (result) {
        if (result.isBlocked)
          return this.responseHandler.send({
            res,
            statusCode: 403,
            returnObj: "this user is blocked",
          });
        return this.responseHandler.send({
          res,
          statusCode: 200,
          returnObj: result,
        });
      } else {
        return this.responseHandler.send({
          res,
          statusCode: 400,
          returnObj: "such user id doesn't exist",
        });
      }
    } catch (error: any) {
      return this.responseHandler.send({
        res,
        statusCode: 500,
        returnObj: error.message,
      });
    }
  };

  DeleteUserById = async (req: Request, res: Response) => {
    try {
      const result = await this.userService.deleteUser(req.params._id);

      if (result) {
        return this.responseHandler.send({
          res,
          statusCode: 200,
          returnObj: "Deleted",
        });
      } else {
        return this.responseHandler.send({
          res,
          statusCode: 400,
          returnObj: "such user id doesn't exist",
        });
      }
    } catch (error: any) {
      return this.responseHandler.send({
        res,
        statusCode: 500,
        returnObj: error.message,
      });
    }
  };

  UpdateUserById = async (req: Request, res: Response) => {
    try {
      const updateQuery = await this.userService.checkFeildsNeedsToUpdate(
        req.body
      );

      //if there is any statusCode returned, that means problem!
      if (updateQuery.statusCode)
        return this.responseHandler.send({
          res,
          ...updateQuery,
        });

      const result = await this.userService.updateUser(
        req.params._id,
        updateQuery
      );

      if (result) {
        return this.responseHandler.send({
          res,
          statusCode: 200,
          returnObj: result,
        });
      } else {
        return this.responseHandler.send({
          res,
          statusCode: 400,
          returnObj: "no user found with this id to update",
        });
      }
    } catch (error: any) {
      return this.responseHandler.send({
        res,
        statusCode: 500,
        returnObj: error.message,
      });
    }
  };
}

export default new UserController({
  UserModel,
  ResponseHandler,
  UserService,
});
