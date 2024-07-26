import { userModel, responseHandler } from "../types";
import UserReposetory, {
  UserReposetory as userReposetory,
} from "./user.reposetory";
import { ResponseHandler } from "../handlers";

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

  createUser = async (user: userModel) =>
    await this.userReposetory.createUser(user);
  updateUser = async (_id: string, user: any) =>
    await this.userReposetory.updateUser(_id, user);
  getUser = async (_id: string) => this.userReposetory.getUser(_id);
  deleteUser = async (_id: string) => this.userReposetory.deleteUser(_id);
  /**
   * check if the PhoneNumber is in iran's correct format
   * @param res express Respone
   * @param phoneNumber the PhoneNumber to check
   * @returns
   */
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

  checkFeildsNeedsToUpdate = async (newData: any): Promise<object> => {
    let updateQuery = {
      phoneNumber: undefined,
      userName: undefined,
      password: undefined,
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      isBlocked: undefined,
    };

    if (newData.new_phoneNumber.trim().length !== 0) {
      if (!this.isPhoneNumberValid(newData.new_phoneNumber))
        return {
          statusCode: 409,
          returnObj: "phone number should formatted like 09xxxxxxxxx",
        };

      if (await this.isPhoneNumberExist(newData.new_phoneNumber))
        return {
          statusCode: 409,
          returnObj: "a user with this phone number exist",
        };

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

    return updateQuery;
  };
}

export default new UserService({
  UserReposetory,
  ResponseHandler,
});
