import { Server } from "socket.io";
import http from "http";
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const FRONTEND_URL = process.env.FRONTEND_URL;

const io = new Server(server, {
  cors: {
    origin: [FRONTEND_URL as string],
    methods: ["GET", "POST"],
    credentials: true
  }
});

const userSocketMap: Record<string, string> = {};  // { userId: socketId }

export function getReceiverSocketId(userId: string) {
  return userSocketMap[userId];
}

io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    console.log("No token provided");
    return next(new Error("Authentication error"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    socket.data.userId = decoded.userId;
    next();
  } catch (err) {
    console.log("Invalid token");
    return next(new Error("Authentication error"));
  }
});


io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.data.userId as string; 

  if (!userId) {
    console.log("Missing userId after auth, disconnecting");
    return socket.disconnect();
  }

  userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
