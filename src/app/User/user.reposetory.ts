const User = require("./user.model");
import { ObjectId } from "mongoose";

class UserReposetory {
  user: any;
  constructor(User: any) {
    this.user = User;
  }

  createUser = async (user: any) => await new this.user(user).save();
  updateUser = async (_id: string, user: object) =>
    await this.user.findByIdAndUpdate(_id, user, { new: true });
  getUser = async (_id: string) => this.user.findById(_id);
  deleteUser = async (_id: string) => this.user.findByIdAndDelete(_id);

  isPhoneNumberExist = async (phoneNumber: string) => {
    const result = await this.user.findOne({
      phoneNumber: phoneNumber,
    });

    if (result) return true;
    else return false;
  };
}

module.exports = new UserReposetory(User);
