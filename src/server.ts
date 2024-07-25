import express from "express";
const app = express();
const PORT = 3000;
import { Routes } from "./app/Route";
import db from "./app/Database/index.js";
db.connect("mongodb://localhost:27017/firstApi");

app.use(express.json());
app.use("/api", Routes);

app.listen(PORT, () => {
  console.log(`Server is on http://localhost:${PORT}`);
});
