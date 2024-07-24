const UserReposetory = require("./user.reposetory");
const { ResponseHandler } = require("../handlers");
import { Request, Response } from "express";
import { ObjectId } from "mongoose";

class UserService {
  userReposetory: any;
  responseHandler: any;
  constructor({
    UserReposetory,
    ResponseHandler,
  }: {
    UserReposetory: any;
    ResponseHandler: any;
  }) {
    this.userReposetory = UserReposetory;
    this.responseHandler = ResponseHandler;
  }

  createUser = async (user: any) => await this.userReposetory.createUser(user);
  updateUser = async (_id: string, user: any) =>
    await this.userReposetory.updateUser(_id, user);
  getUser = async (_id: string) => this.userReposetory.getUser(_id);
  deleteUser = async (_id: string) => this.userReposetory.deleteUser(_id);

  isPhoneNumberValid = (res: Response, phoneNumber: string) => {
    if (!/09[0-9]{9,9}/.test(phoneNumber))
      return this.responseHandler.send({
        res,
        statusCode: 409,
        returnObj: "phone num format should be 09xxxxxxxxx",
      });
  };

  isPhoneNumberExist = async (res: any, phoneNumber: string) => {
    try {
      const result: boolean = await this.userReposetory.isPhoneNumberExist(
        phoneNumber
      );

      if (result)
        return this.responseHandler.send({
          res,
          statusCode: 409,
          returnObj: "a user with this phone number exist",
        });
    } catch (error: any) {
      return this.responseHandler.send({
        res,
        statusCode: 500,
        returnObj: error.message,
      });
    }
  };

  checkFeildsNeedsToUpdate = async (res: Response, newData: any) => {
    let updateQuery = {
      phoneNumber: "",
      userName: "",
      password: "",
      firstName: "",
      lastName: "",
      email: "",
      isBlocked: "",
    };

    if (newData.new_phoneNumber.trim().length !== 0) {
      if (
        this.isPhoneNumberValid(res, newData.phoneNumber) ||
        (await this.isPhoneNumberExist(res, newData.phoneNumber))
      ) {
        return;
      }

      updateQuery.phoneNumber = newData.new_phoneNumber;
    }

    if (newData.new_userName.trim().length !== 0)
      updateQuery.userName = newData.new_userName;

    if (newData.new_password.trim().length !== 0)
      updateQuery.password = newData.new_password;

    if (newData.new_firstName.trim().length !== 0)
      updateQuery.firstName = newData.new_lastName;

    if (newData.new_lastName.trim().length !== 0)
      updateQuery.lastName = newData.new_lastName;

    if (newData.new_email.trim().length !== 0)
      updateQuery.email = newData.new_email;

    if (typeof newData.new_isBlocked === "boolean")
      updateQuery.isBlocked = newData.new_isBlocked;

    return updateQuery;
  };
}

module.exports = new UserService({ UserReposetory, ResponseHandler });
