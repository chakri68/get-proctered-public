import axios from "axios";

export const BACKEND_URL = "https://192.168.157.69:4000/";

try {
  // @ts-ignore
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
} catch (e) {}

const instance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

export default instance;
