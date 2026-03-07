import { io } from "socket.io-client";

export const socket = io("https://baat-chit-backend-b2db.onrender.com", {
  autoConnect: false,
});
