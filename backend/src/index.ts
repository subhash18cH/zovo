import express from "express";
import authRoutes from "./routes/user";
import { connectToDB } from "./db/db";
import cookieParser from "cookie-parser";


//initializing express
const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());

//auth routes
app.use("/api/auth", authRoutes)

//entry point
app.listen(3000, () => {
  console.log("server is rinning");
  connectToDB();//db connection
})