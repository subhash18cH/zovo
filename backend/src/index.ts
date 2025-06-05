import express from "express";
import authRoutes from "./routes/user";
import { connectToDB } from "./db/db";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes)

app.listen(3000, () => {
  console.log("server is rinning");
  connectToDB();
})