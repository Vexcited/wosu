import express from "express";
import routes from "./routes";
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api", routes);

export const handler = app;
