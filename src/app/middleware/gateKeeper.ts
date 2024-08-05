import { role } from "../User/types";
import { Response } from "express";
import ResponseHandler from "../handlers";

const gateKeeper = function async(allowedRoles: role[]) {
  return async (req: any, res: Response, next: any) => {
    for (let i = 0; i < req.roles.length; i++) {
      if (!allowedRoles.includes(req.roles[i])) {
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

export default gateKeeper;
