import { Request, Response } from "express";

export interface responseHandler {
  send({
    res,
    statusCode,
    returnObj,
  }: {
    res: Response;
    statusCode: number;
    returnObj: object | string;
  }): Response;
}

export interface userModel {
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  isBlocked: boolean;
}
