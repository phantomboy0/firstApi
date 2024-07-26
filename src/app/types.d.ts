import { Request, Response } from "express";
import { responseHandler } from "./handlers";

export { responseHandler };

export interface userModel {
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  isBlocked: boolean;
}
