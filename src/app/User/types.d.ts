export interface userModel {
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  isBlocked: boolean;
}

import { UserReposetory } from "./user.reposetory";
export { UserReposetory as userReposetory };

import { UserService as userService } from "./user.service";
export { userService };
