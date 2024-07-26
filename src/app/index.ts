import express from "express";
const app = express();
import { Routes } from "./Route";
import db from "./Database/index.js";

class App {
  appPort: number;
  mongoePort: number;
  constructor(appPort: number, mongoPort: number) {
    this.appPort = appPort;
    this.mongoePort = mongoPort;
    this.InitializeApp(this.appPort, this.mongoePort);
  }

  InitializeApp = (appPort: number, mongoPort: number) => {
    db.connect(`mongodb://localhost:${mongoPort}/firstApi`);

    app.use(express.json());
    app.use("/api", Routes);

    app.listen(appPort, () => {
      console.log(`Server is on http://localhost:${appPort}`);
    });
  };
}

export default App;
