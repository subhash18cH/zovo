import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user";

interface RegisterRequest {
  fullName: string,
  email: string,
  password: string,
  profilePic?: string
}

export const registerUser = async (req: Request<{}, {}, RegisterRequest>, res: Response): Promise<void> => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      res.status(400).json({ message: "All fields required" });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ message: "Password must be atleast 6 characters" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword
    })
    if (newUser) {
      res.status(201).json("user registered successfully");
      return;
    } else {
      res.status(400).json({ message: "Invalid user data" });
      return;
    }
  } catch (error) {
    console.log(error);
  }
}