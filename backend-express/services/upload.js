import { ROOT_DIR } from "../utils/env.js";
import fs from "fs";

/**
 * Uploads a file to the server
 * @param {Buffer} file
 * @param {string} name
 */
export async function uploadFile(name, file) {
  // Save it to the disk
  const image_dir = `${ROOT_DIR}/public/images`;
  if (!fs.existsSync(image_dir)) {
    fs.mkdirSync(image_dir, { recursive: true });
  }

  const path = `${image_dir}/${name
    .replace(/[^a-zA-Z0-9.]/g, "_")
    .replace(/_+/g, "_")}`;

  fs.writeFileSync(path, file);

  return path;
}
