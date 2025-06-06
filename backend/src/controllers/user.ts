import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import cloudinary from "../libs/cloudinary";

// register request format
interface RegisterRequest {
  fullName: string,
  email: string,
  password: string,
  profilePic?: string
}

// login request format
interface LoginRequest {
  email: string,
  password: string,
}

//extended user request
interface AuthenticatedRequest extends Request {
  user?: {
    email: string;
    userId: string;
  };
}

//POST- api/auth/signup - for registering user
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
      password: hashedPassword,
    })
    if (newUser) {
      res.status(201).json("user registered successfully");
      return;
    } else {
      res.status(400).json({ message: "Invalid user data" });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

//POST- api/auth/login - for login user
export const loginUser = async (req: Request<{}, {}, LoginRequest>, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "All fields required" });
      return;
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    const isMatch: boolean = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    const token: string = jwt.sign({
      userId: user._id,
      email: user.email
    }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV != "development"
    })

    res.status(200).json({ token, email: user.email, fullName: user.fullName, createdAt: user.createdAt, profilePic: user.profilePic });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

//POST- api/auth/logout - for logout user
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json("logged out successfully");
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

//PUT- api/auth/update-profile - for updating profile image of a user
export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { profilePic }: { profilePic: string } = req.body;
    const userId = req.user?.userId;

    if (!profilePic) {
      res.status(400).json("Profile pic is required");
      return;
    }
    const updatedProfile = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: updatedProfile.secure_url }, { new: true })

    res.status(200).json(updatedUser);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

//GET- api/auth/check - for checking user authentication
export const checkAuth = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    res.status(200).json(req.user);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}