import express from "express";
import cookieParser from "cookie-parser";
import buildRoutes from "./utils/build-routes.js";
import { loadModels } from "./services/check-face.js";
import cors from "cors";
import fs from "fs";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

const port = 4000;

const sslOptions = {
  key: fs.readFileSync(__dirname + "/ssl/ilara.com.key"),
  cert: fs.readFileSync(__dirname + "/ssl/ilara.com.crt"),
};

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("App running on port 3000");
});

// Load Models
await loadModels();

// Routes
const routes = await buildRoutes();

console.log("Built Routes");
console.log(routes);

Object.entries(routes).forEach(([route, controller]) => {
  app.use(route, controller);
});

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });

https.createServer(sslOptions, app).listen(port, () => {
  console.log(`Example app listening at https://localhost:${port}`);
});
