import { Server } from "socket.io";
import http from "http";
import express, { Express } from "express";
import { log } from "console";

const app = express();
const server = http.createServer(app);
const FRONTEND_URL = process.env.FRONTEND_URL;
const io = new Server(server, {
  cors: {
    origin: [FRONTEND_URL as string]
  }
});


//used to store online users
const userSocketMap: Record<string, string> = {};  //{userId:socketId}

export function getReceiverSocketId(userId: string) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId as string;

  if (!userId || userId === "undefined") {
    console.log("Invalid userId, disconnecting socket.");
    return socket.disconnect();
  }


  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  //io.emit is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  })

})

export { io, app, server };