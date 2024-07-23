class ResponseHandler {
  constructor(res, statusCode, returnObj) {
    this.res = res;
    this.statusCode = statusCode;
    this.returnObj = returnObj;
  }

  send({ res, statusCode, returnObj }) {
    //if returnObj arg is string , show it as msg
    if (typeof returnObj === "string") {
      return res.status(statusCode).json({ msg: returnObj });
    }
    return res.status(statusCode).json(returnObj);
  }
}

module.exports = new ResponseHandler();
