import { ObjectId } from "mongoose";
import { Request, Response } from "express";

export interface createUserInterface {
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  isBlocked: boolean;
  avatar: ObjectId;
}

import { UserReposetory } from "./user.reposetory";
export { UserReposetory as userReposetory };

import { UserService as userService } from "./user.service";
import { Type } from "typescript";
export { userService };
