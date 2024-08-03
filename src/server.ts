//Version 1.0.0

import App from "./app";
const PORT: number = Number(process.env.PORT ?? 3000);
const MongoPORT: number = Number(process.env.MongoPORT ?? 27017);

new App(PORT, MongoPORT);
