import User from "./user.model";
class UserReposetory {
    user;
    constructor(User) {
        this.user = User;
    }
    createUser = async (user) => await new this.user(user).save();
    updateUser = async (_id, user) => await this.user.findByIdAndUpdate(_id, user, { new: true });
    getUser = async (_id) => await this.user.findById(_id);
    deleteUser = async (_id) => await this.user.findByIdAndDelete(_id);
    isPhoneNumberExist = async (phoneNumber) => {
        if (await this.user.findOne({
            phoneNumber: phoneNumber,
        }))
            return true;
        else
            return false;
    };
}
export { UserReposetory };
export default new UserReposetory(User);
//# sourceMappingURL=user.reposetory.js.map