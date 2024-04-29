import axios from "axios";

export const BACKEND_URL = "https://localhost:4000";

const instance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

export default instance;
