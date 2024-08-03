import UserModel from "./user.model";
import ResponseHandler from "../handlers";
import { responseHandler } from "../handlers/types";
import { userService } from "./types";
import { RequestExtended } from "../types";
import UserService from "./user.service";
import { Response } from "express";
import { bcrypt, jwt } from "../util";
import { Types } from "mongoose";

class UserController {
  userModel: any;
  responseHandler: responseHandler;
  userService: userService;

  constructor({
    UserModel,
    ResponseHandler,
    UserService,
  }: {
    UserModel: any;
    ResponseHandler: responseHandler;
    UserService: userService;
  }) {
    this.userModel = UserModel;
    this.responseHandler = ResponseHandler;
    this.userService = UserService;
  }

  RegisterUser = async (req: RequestExtended, res: Response) => {
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
          returnObj: "a user with this phone number exist",
        });

      try {
        const result = await this.userService.createUser(req.body);
        return this.responseHandler.send({
          res,
          statusCode: 201,
          returnObj: result,
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

  FindUserById = async (req: RequestExtended, res: Response) => {
    try {
      const result = await this.userService.getUser(
        //@ts-ignore
        new Types.ObjectId(req.params._id)
      );

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

  DeleteUserById = async (req: RequestExtended, res: Response) => {
    try {
      if (req.role !== "ADMIN")
        if (req._id != req.params._id)
          return this.responseHandler.send({
            res,
            statusCode: 403,
            returnObj: "you can't delete other's data",
          });

      const result = await this.userService.deleteUser(
        //@ts-ignore
        new Types.ObjectId(req.params._id)
      );

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

  UpdateUserById = async (req: RequestExtended, res: Response) => {
    try {
      if (req.role !== "ADMIN")
        if (req._id != req.params._id)
          return this.responseHandler.send({
            res,
            statusCode: 403,
            returnObj: "you can't change other's data",
          });

      const updateQuery = await this.userService.checkFeildsNeedsToUpdate(
        res,
        req.body
      );
      const result = await this.userService.updateUser(
        //@ts-ignore
        new Types.ObjectId(req.params._id),
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

  Login = async (req: RequestExtended, res: Response) => {
    const { userName, password } = req.body;
    const findedUser = await this.userService.findUserByUserName(userName);

    if (!findedUser)
      return this.responseHandler.send({
        res,
        statusCode: 403,
        returnObj: "Couln't find the user",
      });

    const comperePassword = await bcrypt.comparePassword(
      password,
      findedUser.password
    );

    if (!comperePassword)
      return this.responseHandler.send({
        res,
        statusCode: 403,
        returnObj: "Wrong Password",
      });

    const accessToken: string = await jwt.tokenGenarator({
      userName: findedUser.userName,
      _id: findedUser._id,
    });

    await this.userService.updateAccessToken(findedUser._id, accessToken);
    return this.responseHandler.send({
      res,
      statusCode: 200,
      returnObj: {
        firstName: findedUser.firstName,
        lastName: findedUser.lastName,
        _id: findedUser._id,
        phoneNumber: findedUser.phoneNumber,
        email: findedUser.email,
        avatar: findedUser.avatar,
        accessToken,
      },
    });
  };

  FindMe = async (req: RequestExtended, res: Response) => {
    try {
      const result = await this.userService.getUser(req._id);

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
}

export default new UserController({
  UserModel,
  ResponseHandler,
  UserService,
});
