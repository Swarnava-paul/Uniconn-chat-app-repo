import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "https://uniconn-chat-app-repo-dw8d5g67b-kalkeshwars-projects.vercel.app",
    ],
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

let userSocketMap = {}; //{userId:socketID}

io.on("connection", (socket) => {
  console.log("new connection", socket.id);
  const userId = socket.handshake.query.userId;

  if (userId != undefined) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, httpServer };
