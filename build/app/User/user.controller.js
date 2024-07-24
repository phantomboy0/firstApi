"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel = require("./user.model");
const { ResponseHandler } = require("../handlers");
const UserService = require("./user.service");
console.log(typeof UserModel);
class UserController {
    userModel;
    responseHandler;
    userService;
    constructor({ UserModel, ResponseHandler, UserService, }) {
        this.userModel = UserModel;
        this.responseHandler = ResponseHandler;
        this.userService = UserService;
    }
    RegisterUser = async (req, res) => {
        try {
            if (this.userService.isPhoneNumberValid(res, req.body.phoneNumber) ||
                (await this.userService.isPhoneNumberExist(res, req.body.phoneNumber))) {
                return;
            }
            const newUser = new this.userModel(req.body);
            try {
                await this.userService.createUser(newUser);
                return this.responseHandler.send({
                    res,
                    statusCode: 201,
                    returnObj: newUser,
                });
            }
            catch (error) {
                return this.responseHandler.send({
                    res,
                    statusCode: 400,
                    returnObj: { error: error.message },
                });
            }
        }
        catch (error) {
            return this.responseHandler.send({
                res,
                statusCode: 500,
                returnObj: { error: error.message },
            });
        }
    };
    FindUserById = async (req, res) => {
        try {
            const result = await this.userService.getUser(req.params._id);
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
            }
            else {
                return this.responseHandler.send({
                    res,
                    statusCode: 400,
                    returnObj: "such user id doesn't exist",
                });
            }
        }
        catch (error) {
            return this.responseHandler.send({
                res,
                statusCode: 500,
                returnObj: error.message,
            });
        }
    };
    DeleteUserById = async (req, res) => {
        try {
            const result = await this.userService.deleteUser(req.params._id);
            if (result) {
                return this.responseHandler.send({
                    res,
                    statusCode: 200,
                    returnObj: "Deleted",
                });
            }
            else {
                return this.responseHandler.send({
                    res,
                    statusCode: 400,
                    returnObj: "such user id doesn't exist",
                });
            }
        }
        catch (error) {
            return this.responseHandler.send({
                res,
                statusCode: 500,
                returnObj: error.message,
            });
        }
    };
    UpdateUserById = async (req, res) => {
        try {
            const updateQuery = await this.userService.checkFeildsNeedsToUpdate(res, req.body);
            const result = await this.userService.updateUser(req.params._id, updateQuery);
            if (result) {
                return this.responseHandler.send({
                    res,
                    statusCode: 200,
                    returnObj: result,
                });
            }
            else {
                return this.responseHandler.send({
                    res,
                    statusCode: 400,
                    returnObj: "no user found with this id to update",
                });
            }
        }
        catch (error) {
            return this.responseHandler.send({
                res,
                statusCode: 500,
                returnObj: error.message,
            });
        }
    };
}
module.exports = new UserController({
    UserModel,
    ResponseHandler,
    UserService,
});
//# sourceMappingURL=user.controller.js.map