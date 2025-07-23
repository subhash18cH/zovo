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
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];

    const token = typeof authHeader === "string" && authHeader && authHeader.startsWith("Bearer") && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "No Token found" });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
      const user = await User.findById(decoded.userId).select("-password");
      if (!user) {
        res.status(401).json({ message: "Unauthorized - User not found" });
        return;
      }
      req.user = {
        userId: decoded.userId,
        email: user.email,
        fullName: user.fullName,
        profilePic: user.profilePic,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      next();
    } catch (jwtError) {
      res.status(403).json({ message: "Invalid or expired token" });
      return;
    }

  } catch (error) {
    res.status(500).json({ message: "Server error" });
    return;
  }
};