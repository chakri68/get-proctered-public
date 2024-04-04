import fs from "fs";
import { ROOT_DIR } from "./env.js";
import { joinPath } from "./url.js";

export default async function buildRoutes() {
  const controllers = fs.readdirSync(`${ROOT_DIR}/controllers`);

  const routes = {};

  for (const controllerName of controllers) {
    const controllerPath = `${ROOT_DIR}/controllers/${controllerName}/index.js`;
    const controllerModule = await import(controllerPath);
    const map = controllerModule.default;
    Object.keys(map).forEach((route) => {
      routes["/" + joinPath(controllerName, route)] = map[route];
    });
  }

  return routes;
}
