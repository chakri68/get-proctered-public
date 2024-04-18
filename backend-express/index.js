import express from "express";
import cookieParser from "cookie-parser";
import buildRoutes from "./utils/build-routes.js";
import { loadModels } from "./services/check-face.js";

const app = express();

const port = 3000;

app.use(cookieParser());
app.use(express.json());

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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
