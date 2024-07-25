"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 3000;
const Route_1 = require("./app/Route");
const index_js_1 = __importDefault(require("./app/Database/index.js"));
index_js_1.default.connect("mongodb://localhost:27017/firstApi");
app.use(express_1.default.json());
app.use("/api", Route_1.Routes);
app.listen(PORT, () => {
    console.log(`Server is on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map