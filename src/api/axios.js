import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

const instance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Timeout after 10 seconds
  headers: { "Content-Type": "application/json" },
});

export default instance;
