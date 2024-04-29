import axios from "axios";

const instance = axios.create({
  baseURL: "https://localhost:4000",
  withCredentials: true,
});

export default instance;
