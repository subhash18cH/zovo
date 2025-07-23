import express from "express";
import authRoutes from "./routes/user";
import messageRoutes from "./routes/message";
import { connectToDB } from "./db/db";
import cors from "cors"
import { app, server } from "./libs/socket"
const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

//middlewares
app.use(express.json());

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

//auth routes
app.use("/api/auth", authRoutes)

//message routes
app.use("/api/message", messageRoutes)

//entry point
server.listen(PORT, () => {
  console.log("server is running on " + PORT);
  connectToDB();//db connection
})