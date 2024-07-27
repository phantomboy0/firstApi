import express from "express";
const app = express();
import { Routes } from "./Route";
import db from "./Database/index.js";
class App {
    appPort;
    mongoePort;
    constructor(appPort, mongoPort) {
        this.appPort = appPort;
        this.mongoePort = mongoPort;
        this.InitializeApp(this.appPort, this.mongoePort);
    }
    InitializeApp = (appPort, mongoPort) => {
        db.connect(`mongodb://localhost:${mongoPort}/firstApi`);
        app.use(express.json());
        app.use("/api", Routes);
        app.listen(appPort, () => {
            console.log(`Server is on http://localhost:${appPort}`);
        });
    };
}
export default App;
//# sourceMappingURL=index.js.map