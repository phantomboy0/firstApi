"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const Route_1 = require("./Route");
const index_js_1 = __importDefault(require("./Database/index.js"));
class App {
    appPort;
    mongoePort;
    constructor(appPort, mongoPort) {
        this.appPort = appPort;
        this.mongoePort = mongoPort;
        this.InitializeApp(this.appPort, this.mongoePort);
    }
    InitializeApp = (appPort, mongoPort) => {
        index_js_1.default.connect(`mongodb://localhost:${mongoPort}/firstApi`);
        app.use(express_1.default.json());
        app.use("/api", Route_1.Routes);
        app.listen(appPort, () => {
            console.log(`Server is on http://localhost:${appPort}`);
        });
    };
}
exports.default = App;
//# sourceMappingURL=index.js.map