"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._ResponseHandler = exports.ResponseHandler = void 0;
class ResponseHandler {
    constructor() {
    }
    send({ res, statusCode, returnObj, }) {
        if (typeof returnObj === "string") {
            return res.status(statusCode).json({ msg: returnObj });
        }
        else {
            return res.status(statusCode).json(returnObj);
        }
    }
}
exports.ResponseHandler = ResponseHandler;
exports._ResponseHandler = new ResponseHandler();
//# sourceMappingURL=responsehandler.js.map