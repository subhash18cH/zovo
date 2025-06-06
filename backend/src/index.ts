import express from "express";
import authRoutes from "./routes/user";
import messageRoutes from "./routes/message";
import { connectToDB } from "./db/db";
import cookieParser from "cookie-parser";


//initializing express
const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());

//auth routes
app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

//entry point
app.listen(3000, () => {
  console.log("server is rinning");
  connectToDB();//db connection
})