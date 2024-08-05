import { UserService } from "../User";
import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import util from "../util";
import ResponseHandler from "../handlers";
import { role } from "../User/types";

async function isTokenValid(accessToken: string): Promise<boolean> {
  if (!jwt.decode(accessToken)) return false;

  if ((await util.jwt.tokenVerify(accessToken)) === "expire") return false;

  return true;
}

const heimdall = async (req: any, res: Response, next: any) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken)
    return ResponseHandler.send({
      res,
      statusCode: 403,
      returnObj: "token not found!",
    });

  if (!isTokenValid(accessToken as string))
    return ResponseHandler.send({
      res,
      statusCode: 401,
      returnObj: "token is not valid",
    });

  const decodeToken: any = jwt.decode(accessToken as string);
  if (!decodeToken?._id)
    return ResponseHandler.send({
      res,
      statusCode: 403,
      returnObj: "auth failed",
    });
  const foundedUser = await UserService.getUser(decodeToken._id);
  if (!foundedUser)
    return ResponseHandler.send({
      res,
      statusCode: 403,
      returnObj: "user not found",
    });

  req._id = foundedUser._id;
  req.roles = foundedUser.roles;
  console.log(req.roles);

  next();
};

export default heimdall;
