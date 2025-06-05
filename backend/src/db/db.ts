import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

//db connection
export const connectToDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string)
    console.log("db connected");
  } catch (error) {
    console.log(error);
  }
}