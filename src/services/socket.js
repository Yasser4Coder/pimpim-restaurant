import { io } from "socket.io-client";

// Correctly read the environment variable with a fallback
const URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// console.log("Attempting to connect WebSocket to:", URL);

const socket = io(URL, {
  transports: ["websocket"],
});

export default socket;
