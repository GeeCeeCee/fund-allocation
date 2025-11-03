import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import handler from "./routes";
import bodyParser from "body-parser";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", handler);

if (port != null) {
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
} else {
  console.error("PORT is not defined in environment variables.");
}
