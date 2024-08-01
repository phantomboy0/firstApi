import User from "./user.model";
import { createUserInterface } from "./types";
import { ObjectId } from "mongoose";

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

  updateAccessToken = async (_id: string, accessToken: string) =>
    await this.user.findByIdAndUpdate(_id, { accessToken });
}

export { UserReposetory };
export default new UserReposetory(User);
