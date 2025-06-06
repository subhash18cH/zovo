import express from "express";
import authRoutes from "./routes/user";
import messageRoutes from "./routes/message";
import { connectToDB } from "./db/db";
import cookieParser from "cookie-parser";
import cors from "cors"

const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

//initializing express
const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


//auth routes
app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

//entry point
app.listen(PORT, () => {
  console.log("server is running on " + PORT);
  connectToDB();//db connection
})