import { role } from "../User/types";
import { Response } from "express";
import ResponseHandler from "../handlers";
import jwt from "jsonwebtoken";
import { UserService } from "../User";
import { RequestExtended } from "../types";
import { log } from "console";

const razvan = function async(allowedRoles: role[]) {
  return async (req: any, res: Response, next: any) => {
    for (let i = 0; i < allowedRoles.length; i++) {
      if (!req.roles.includes(allowedRoles[i])) {
        console.log(allowedRoles[i]);

        return ResponseHandler.send({
          res,
          statusCode: 403,
          returnObj: "this user's roles can't access this endpoint",
        });
      }
    }
    next();
  };
};

export default razvan;
