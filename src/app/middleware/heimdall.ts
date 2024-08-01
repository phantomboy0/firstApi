import { UserService } from "../User";
import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import util from "../util";
import ResponseHandler from "../handlers";
import { role } from '../User/types'

async function isTokenValid(accessToken: string): Promise<boolean> {
  if (!jwt.decode(accessToken)) return false;

  if ((await util.jwt.tokenVerify(accessToken)) === "expire") return false;

  return true;
}

const heimdall = function async ( baseRequieredRole:role) {
return async (req: any, res: Response, next: any) => {
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

  isUserRoleSufficient(foundedUser.role,baseRequieredRole,res)

  req._id = foundedUser._id;
  next();
}
};

const isUserRoleSufficient = (userRole:string, baseRequieredRole:role, res:Response) => {
  if(!baseRequieredRole)
    console.error("no requiered role defined for heimdall")

  if (userRole !== "USER" && userRole !== "ADMIN" && baseRequieredRole === "USER")
    return ResponseHandler.send({
      res,
      statusCode: 403,
      returnObj: "You need to be a user to access this URI",
    });

  if (userRole!== "ADMIN" && baseRequieredRole === "ADMIN")
    return ResponseHandler.send({
      res,
      statusCode: 403,
      returnObj: "You need to be an admin to access this URI",
    });

}


export default heimdall;
