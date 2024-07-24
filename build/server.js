"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
const PORT = 3000;
const Routes = require("./app/Route");
const db = require("./app/Database");
app.use(express.json());
app.use("/api", Routes);
app.listen(PORT, () => {
    console.log(`Server is on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map