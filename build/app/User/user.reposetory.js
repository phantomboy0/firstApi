"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User = require("./user.model");
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
        const result = await this.user.findOne({
            phoneNumber: phoneNumber,
        });
        if (result)
            return true;
        else
            return false;
    };
}
module.exports = new UserReposetory(User);
//# sourceMappingURL=user.reposetory.js.map