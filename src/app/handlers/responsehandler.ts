import { Response } from "express";

class ResponseHandler {
  constructor(/*res, statusCode, returnObj*/) {
    // this.res = res;
    // this.statusCode = statusCode;
    // this.returnObj = returnObj;
  }

  send({
    res,
    statusCode,
    returnObj,
  }: {
    res: Response;
    statusCode: number;
    returnObj: object | string;
  }): Response {
    //if returnObj param is string , show it as msg
    if (typeof returnObj === "string") {
      return res.status(statusCode).json({ msg: returnObj });
    } else {
      return res.status(statusCode).json(returnObj);
    }
  }
}
export { ResponseHandler };
export const _ResponseHandler = new ResponseHandler();
