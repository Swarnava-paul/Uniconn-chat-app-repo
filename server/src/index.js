import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./db/index.js";
import authRoutes from "../src/routes/auth.routes.js";
import messageRoutes from "../src/routes/message.routes.js";
import userRoutes from "../src/routes/user.routes.js";
import collegeRoutes from "../src/routes/college.routes.js";
import { app, httpServer } from "./socket/socket.js";

app.use(
  cors({
    origin:
      "https://uniconn-chat-app-repo-dw8d5g67b-kalkeshwars-projects.vercel.app",
    credentials: true,
  })
);

app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = process.env.PORT || 3000;

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/colleges", collegeRoutes);

connectDB();

httpServer.listen(port, () => {
  console.log("server is starting...");
});
