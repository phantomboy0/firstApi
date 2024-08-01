import { responseHandler } from "../handlers/types";
import { createUserInterface, userReposetory } from "./types";
import UserReposetory from "./user.reposetory";
import ResponseHandler from "../handlers";
import { Request, Response } from "express";
import { bcrypt } from "../util";
import { ObjectId } from "mongoose";

class UserService {
  userReposetory: userReposetory;
  responseHandler: responseHandler;
  constructor({
    UserReposetory,
    ResponseHandler,
  }: {
    UserReposetory: userReposetory;
    ResponseHandler: responseHandler;
  }) {
    this.userReposetory = UserReposetory;
    this.responseHandler = ResponseHandler;
  }

  createUser = async (user: createUserInterface) =>
    await this.userReposetory.createUser({
      ...user,
      password: bcrypt.hashPassword(user.password),
    });

  updateUser = async (_id: ObjectId, user: any) =>
    await this.userReposetory.updateUser(_id, user);

  getUser = async (_id: ObjectId) => await this.userReposetory.getUser(_id);

  findUserByUserName = async (userName: string) =>
    await this.userReposetory.findUserByUserName(userName);

  deleteUser = async (_id: ObjectId) => this.userReposetory.deleteUser(_id);

  isPhoneNumberValid = (phoneNumber: string): boolean => {
    if (/^09[0-9]{9}$/.test(phoneNumber)) return true;
    else return false;
  };

  isPhoneNumberExist = async (phoneNumber: string) => {
    try {
      const result: boolean = await this.userReposetory.isPhoneNumberExist(
        phoneNumber
      );

      if (result) return true;
      else return false;
    } catch (error: any) {
      console.error(error);
    }
  };

  checkFeildsNeedsToUpdate = async (
    res: Response,
    newData: any
  ): Promise<object> => {
    let updateQuery = {
      phoneNumber: undefined,
      userName: undefined,
      password: undefined,
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      isBlocked: undefined,
      avatar: undefined,
    };

    if (newData.new_phoneNumber.length != 0) {
      if (!this.isPhoneNumberValid(newData.new_phoneNumber)) {
        this.responseHandler.send({
          res,
          statusCode: 409,
          returnObj: "phone number should formatted like 09xxxxxxxxx",
        });
      }

      if (await this.isPhoneNumberExist(newData.new_phoneNumber))
        this.responseHandler.send({
          res,
          statusCode: 409,
          returnObj: "a user with this phone number exist",
        });

      updateQuery.phoneNumber = newData.new_phoneNumber;
    }

    if (typeof newData.new_userName === "string")
      updateQuery.userName = newData.new_userName;

    if (typeof newData.new_password === "string")
      updateQuery.password = newData.new_password;

    if (typeof newData.new_firstName === "string")
      updateQuery.firstName = newData.new_lastName;

    if (typeof newData.new_lastName === "string")
      updateQuery.lastName = newData.new_lastName;

    if (typeof newData.new_email === "string")
      updateQuery.email = newData.new_email;

    if (typeof newData.new_isBlocked === "boolean")
      updateQuery.isBlocked = newData.new_isBlocked;

    if (typeof newData.new_avatar === "string")
      updateQuery.avatar = newData.new_avatar;

    return updateQuery;
  };

  updateAccessToken = async (_id: string, token: string) =>
    await this.userReposetory.updateAccessToken(_id, token);
}

export { UserService };
export default new UserService({
  UserReposetory,
  ResponseHandler,
});
