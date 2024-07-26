import User from "./user.model";
import { userModel } from "../types";

class UserReposetory {
  user: any;
  constructor(User: any) {
    this.user = User;
  }

  createUser = async (user: userModel) => await new this.user(user).save();
  updateUser = async (_id: string, user: userModel) =>
    await this.user.findByIdAndUpdate(_id, user, { new: true });
  getUser = async (_id: string) => this.user.findById(_id);
  deleteUser = async (_id: string) => this.user.findByIdAndDelete(_id);

  isPhoneNumberExist = async (phoneNumber: string): Promise<boolean> => {
    if (
      await this.user.findOne({
        phoneNumber: phoneNumber,
      })
    )
      return true;
    else return false;
  };
}

export { UserReposetory };
export default new UserReposetory(User);
