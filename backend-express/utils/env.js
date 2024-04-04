import dotenv from "dotenv";

dotenv.config();

export const JWT_SECRET = (() => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET not set");
  }
  return JWT_SECRET;
})();

export const ROOT_DIR = (() => {
  const cur_dir = process.cwd();
  return cur_dir;
})();
