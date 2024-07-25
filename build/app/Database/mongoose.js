"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dbConnection = mongoose_1.default.connection;
dbConnection.on("error", console.error.bind(console, "connection error"));
dbConnection.once("open", () => {
    console.log("connected to mangoDB");
});
exports.default = mongoose_1.default;
//# sourceMappingURL=mongoose.js.map