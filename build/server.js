import App from "./app";
const PORT = Number(process.env.PORT ?? 3000);
const MongoPORT = Number(process.env.MongoPORT ?? 27017);
new App(PORT, MongoPORT);
//# sourceMappingURL=server.js.map