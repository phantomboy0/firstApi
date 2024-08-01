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
export { ResponseHandler };
export default new ResponseHandler();
//# sourceMappingURL=responsehandler.js.map