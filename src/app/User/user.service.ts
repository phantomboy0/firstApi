import { responseHandler } from "../handlers/types";
import { createUserInterface, role, userReposetory } from "./types";
import UserReposetory from "./user.reposetory";
import ResponseHandler from "../handlers";
import { Request, Response } from "express";
import { bcrypt } from "../util";
import { ObjectId, Types } from "mongoose";

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
      if (await this.userReposetory.isPhoneNumberExist(phoneNumber))
        return true;
      else return false;
    } catch (error: any) {
      console.error(error);
    }
  };

  isUserNameExist = async (userName: string) => {
    try {
      if (await this.userReposetory.isUserNameExist(userName)) return true;
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

  updateAccessToken = async (_id: ObjectId, token: string) =>
    await this.userReposetory.updateAccessToken(_id, token);

  isThereAnySessionsWithThisRoleAndDevice = async (
    _id: ObjectId,
    role: string,
    device: string
  ) => {
    return await this.userReposetory.getSession(_id, role, device);
  };

  updateExistingSessionAccessToken = async (
    _id: ObjectId,
    role: string,
    device: string,
    newAccessToken: string
  ) => {
    return await this.userReposetory.updateExistingSessionAccessToken(
      _id,
      role,
      device,
      newAccessToken
    );
  };

  reachedMaxActiveSessions = async (
    user: any,
    role: role
  ): Promise<boolean> => {
    if (!user.sessions) return false;

    const countOfSessionsWithThisRole = user.sessions.filter(
      (session: { role: string }) => session.role === role
    ).length;

    console.log(countOfSessionsWithThisRole);

    if (role === "CLIENT")
      if (countOfSessionsWithThisRole < Number(process.env.MAX_CLIENT_SESSIONS))
        return false;

    if (role === "MANAGER")
      if (
        countOfSessionsWithThisRole < Number(process.env.MAX_MANAGER_SESSIONS)
      )
        return false;

    if (role === "MODERATOR")
      if (
        countOfSessionsWithThisRole < Number(process.env.MAX_MODERATOR_SESSIONS)
      )
        return false;

    if (role === "ADMIN")
      if (countOfSessionsWithThisRole < Number(process.env.MAX_ADMIN_SESSIONS))
        return false;

    return true;
  };

  createNewSession = async (
    _id: ObjectId,
    role: string,
    device: string,
    accessToken: string
  ) => {
    return this.userReposetory.createNewSession(_id, {
      role,
      device,
      accessToken,
    });
  };

  createAdminAccountIfThereIsNone = async () => {
    if (!(await this.userReposetory.isThereAnyAdminAccounts())) {
      const result = await this.createUser({
        userName: String(process.env.DEFAULT_USER_NAME),
        password: String(process.env.DEFAULT_USER_PASSWORD),
        firstName: String(process.env.DEFAULT_USER_NAME),
        lastName: String(process.env.DEFAULT_USER_NAME),
        phoneNumber: "09000000000",
        email: "",
        isBlocked: false,
        roles: ["ADMIN"],
        //@ts-ignore
        avatar: new Types.ObjectId("66a53b54534b7a1a60f5f4ed"),
      });
    }
  };

  deleteOldestSessionWithThisRole = async (_id: ObjectId, role: role) => {
    const user = await this.getUser(_id);
    const clientSessions = user.sessions.filter(
      (session: { role: string }) => session.role === role
    );

    if (clientSessions.length === 0) {
      console.log("No CLIENT sessions to remove.");
      return;
    }

    let oldestSession = clientSessions[0];
    let oldestSessionIndex = user.sessions.findIndex(
      (session: { role: string }) => session === oldestSession
    );

    clientSessions.forEach((session: any) => {
      if (session.modifyDate < oldestSession.modifyDate) {
        oldestSession = session;
        oldestSessionIndex = user.sessions.findIndex(
          (s: any) => s === oldestSession
        );
      }
    });

    user.sessions.splice(oldestSessionIndex, 1);
    await user.save();
  };

  LogoutFromAllSessions = async (_id: ObjectId) => {
    return await this.userReposetory.LogoutFromAllSessions(_id);
  };
}

export { UserService };
export default new UserService({
  UserReposetory,
  ResponseHandler,
});
