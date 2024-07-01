import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

let onlineUsers = {}; //{userId:socketID}

io.on("connection", (socket) => {
  console.log("new connection", socket.id);

  socket.on("getOnlineUsers", () => {});

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

export { app, io, httpServer };
