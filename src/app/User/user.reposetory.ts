import User from "./user.model";
import { createUserInterface } from "./types";
import { ObjectId } from "mongoose";
import { Session } from "inspector";

class UserReposetory {
  user: any;
  constructor(User: any) {
    this.user = User;
  }

  createUser = async (user: object) => await new this.user(user).save();
  updateUser = async (_id: ObjectId, user: createUserInterface) =>
    await this.user.findByIdAndUpdate(_id, user, { new: true });
  getUser = async (_id: ObjectId) => await this.user.findById(_id);
  findUserByUserName = async (userName: string) =>
    await this.user.findOne({ userName });
  deleteUser = async (_id: ObjectId) => await this.user.findByIdAndDelete(_id);

  isPhoneNumberExist = async (phoneNumber: string): Promise<boolean> => {
    if (
      await this.user.findOne({
        phoneNumber: phoneNumber,
      })
    )
      return true;
    else return false;
  };

  isUserNameExist = async (userName: string): Promise<boolean> => {
    if (
      await this.user.findOne({
        userName: userName,
      })
    )
      return true;
    else return false;
  };

  updateAccessToken = async (_id: ObjectId, accessToken: string) =>
    await this.user.findByIdAndUpdate(_id, { accessToken });

  isThereAnyAdminAccounts = async () => {
    return await this.user.findOne({ roles: ["ADMIN"] });
  };

  getSession = async (_id: ObjectId, role: string, device: string) => {
    return await this.user.findOne({
      _id,
      "sessions.role": role,
      "sessions.device": device,
    });
  };

  updateExistingSessionAccessToken = async (
    _id: ObjectId,
    role: string,
    device: string,
    newAccessToken: string
  ) => {
    return await this.user.findOneAndUpdate(
      {
        _id,
        "sessions.role": role,
        "sessions.device": device,
      },
      { $set: { "sessions.$.accessToken": newAccessToken } }
    );
  };

  createNewSession = async (_id: ObjectId, newSession: Object) => {
    const user = await this.user.findById(_id);
    if (!user) return "USER NOT FOUND";
    await user.sessions.push(newSession);
    user.save();
  };

  LogoutFromAllSessions = async (_id: ObjectId) => {
    return await this.user.findByIdAndUpdate(_id, { sessions: [] });
  };
}

export { UserReposetory };
export default new UserReposetory(User);
