"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserReposetory = require("./user.reposetory");
const { ResponseHandler } = require("../handlers");
class UserService {
    userReposetory;
    responseHandler;
    constructor({ UserReposetory, ResponseHandler, }) {
        this.userReposetory = UserReposetory;
        this.responseHandler = ResponseHandler;
    }
    createUser = async (user) => await this.userReposetory.createUser(user);
    updateUser = async (_id, user) => await this.userReposetory.updateUser(_id, user);
    getUser = async (_id) => this.userReposetory.getUser(_id);
    deleteUser = async (_id) => this.userReposetory.deleteUser(_id);
    isPhoneNumberValid = (res, phoneNumber) => {
        if (!/09[0-9]{9,9}/.test(phoneNumber))
            return this.responseHandler.send({
                res,
                statusCode: 409,
                returnObj: "phone num format should be 09xxxxxxxxx",
            });
    };
    isPhoneNumberExist = async (res, phoneNumber) => {
        try {
            const result = await this.userReposetory.isPhoneNumberExist(phoneNumber);
            if (result)
                return this.responseHandler.send({
                    res,
                    statusCode: 409,
                    returnObj: "a user with this phone number exist",
                });
        }
        catch (error) {
            return this.responseHandler.send({
                res,
                statusCode: 500,
                returnObj: error.message,
            });
        }
    };
    checkFeildsNeedsToUpdate = async (res, newData) => {
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
            if (this.isPhoneNumberValid(res, newData.phoneNumber) ||
                (await this.isPhoneNumberExist(res, newData.phoneNumber))) {
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
//# sourceMappingURL=user.service.js.map