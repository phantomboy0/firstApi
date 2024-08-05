import UserModel from "./user.model";
import ResponseHandler from "../handlers";
import { responseHandler } from "../handlers/types";
import { userService } from "./types";
import { RequestExtended } from "../types";
import UserService from "./user.service";
import { Response } from "express";
import { bcrypt, jwt } from "../util";
import { Types } from "mongoose";
import { loadEnvFile } from "process";

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

      if (await this.userService.isUserNameExist(req.body.userName))
        return this.responseHandler.send({
          res,
          statusCode: 409,
          returnObj: "a user with this UserName exist",
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
    const { userName, password, loginAs } = req.body;
    const userAgent = req.headers["user-agent"] || "UNDEFINED_USERAGENT";

    const foundedUser = await this.userService.findUserByUserName(userName);

    if (!foundedUser)
      return this.responseHandler.send({
        res,
        statusCode: 403,
        returnObj: "Couln't find the user",
      });

    const comperePassword = await bcrypt.comparePassword(
      password,
      foundedUser.password
    );

    if (!comperePassword)
      return this.responseHandler.send({
        res,
        statusCode: 403,
        returnObj: "Wrong Password",
      });

    for (let i = 0; i < foundedUser.roles.length; i++) {
      if (!foundedUser.roles.includes(loginAs))
        return this.responseHandler.send({
          res,
          statusCode: 403,
          returnObj: "can't login with this role",
        });
    }

    const accessToken: string = await jwt.tokenGenarator({
      userName: foundedUser.userName,
      _id: foundedUser._id,
      loginAs: req.body.loginAs,
    });

    if (
      await this.userService.isThereAnySessionsWithThisRoleAndDevice(
        foundedUser._id,
        loginAs,
        userAgent
      )
    ) {
      console.log("LOGexIST");
      await this.userService.updateExistingSessionAccessToken(
        foundedUser._id,
        loginAs,
        userAgent,
        accessToken
      );
    } else {
      console.log("LOGDosn'texIST");
      if (
        !(await this.userService.reachedMaxActiveSessions(foundedUser, loginAs))
      ) {
        await this.userService.createNewSession(
          foundedUser._id,
          loginAs,
          userAgent,
          accessToken
        );
      } else {
        await this.userService.deleteOldestSessionWithThisRole(
          foundedUser._id,
          loginAs
        );

        await this.userService.createNewSession(
          foundedUser._id,
          loginAs,
          userAgent,
          accessToken
        );
      }
    }

    await this.userService.updateAccessToken(foundedUser._id, accessToken);
    return this.responseHandler.send({
      res,
      statusCode: 200,
      returnObj: {
        firstName: foundedUser.firstName,
        lastName: foundedUser.lastName,
        _id: foundedUser._id,
        phoneNumber: foundedUser.phoneNumber,
        email: foundedUser.email,
        avatar: foundedUser.avatar,
        accessToken,
      },
    });
  };

  LogoutFromAllSessions = async (req: RequestExtended, res: Response) => {
    try {
      const result = await this.userService.LogoutFromAllSessions(
        //@ts-ignore
        new Types.ObjectId(req._id)
      );

      if (result)
        return this.responseHandler.send({
          res,
          statusCode: 200,
          returnObj: "log out from all sessions successfully",
        });
      else
        return this.responseHandler.send({
          res,
          statusCode: 403,
          returnObj: "no user found with this _id",
        });
    } catch (error: unknown) {
      return this.responseHandler.send({
        res,
        statusCode: 510,
        returnObj: { error },
      });
    }
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

  createAdminAccountIfThereIsNone = async () => {
    await this.userService.createAdminAccountIfThereIsNone();
  };
}

export default new UserController({
  UserModel,
  ResponseHandler,
  UserService,
});
