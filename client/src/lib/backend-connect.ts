import axios from "axios";

const instance = axios.create({
  baseURL: "https://192.168.157.69:4000",
  withCredentials: true,
});

export default instance;
