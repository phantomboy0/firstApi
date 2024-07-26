"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = 3000;
const MongoPORT = 27017;
new app_1.default(PORT, MongoPORT);
//# sourceMappingURL=server.js.map