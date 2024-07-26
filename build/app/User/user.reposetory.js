"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserReposetory = void 0;
const user_model_1 = __importDefault(require("./user.model"));
class UserReposetory {
    user;
    constructor(User) {
        this.user = User;
    }
    createUser = async (user) => await new this.user(user).save();
    updateUser = async (_id, user) => await this.user.findByIdAndUpdate(_id, user, { new: true });
    getUser = async (_id) => this.user.findById(_id);
    deleteUser = async (_id) => this.user.findByIdAndDelete(_id);
    isPhoneNumberExist = async (phoneNumber) => {
        if (await this.user.findOne({
            phoneNumber: phoneNumber,
        }))
            return true;
        else
            return false;
    };
}
exports.UserReposetory = UserReposetory;
exports.default = new UserReposetory(user_model_1.default);
//# sourceMappingURL=user.reposetory.js.map