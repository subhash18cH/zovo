import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    fullName: string;
    profilePic?: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
}

export const validateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token: string = req.cookies.jwt;
    if (!token) {
      res.status(401).json({ message: "UnAuthorized - No token provided" });
      return;
    }
    jwt.verify(token, process.env.JWT_SECRET as string, async (err, decoded) => {
      if (err) {
        console.log(err);
        return;
      }
      const { userId } = decoded as { userId: string };
      const user = await User.findById(userId).select("-password");
      if (!user) {
        res.status(401).json({ message: "Unauthorized - User not found" });
        return;
      }
      req.user = {
        userId: userId,
        email: user.email,
        fullName: user.fullName,
        profilePic: user.profilePic,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      next();
    })
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Something went wrong" });
  }
}