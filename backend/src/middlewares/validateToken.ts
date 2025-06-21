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
    console.log("Auth header received:", authHeader ? "exists" : "missing"); // Debug

    const token = typeof authHeader === "string" && authHeader && authHeader.startsWith("Bearer") && authHeader.split(" ")[1];

    console.log("Extracted token:", token ? "exists" : "missing"); // Debug

    if (!token) {
      console.log("No token found in request"); // Debug
      res.status(401).json({ message: "Access token required" });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
      console.log("Token decoded successfully for user:", decoded.userId); // Debug

      const user = await User.findById(decoded.userId).select("-password");
      if (!user) {
        console.log("User not found for ID:", decoded.userId); // Debug
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

      console.log("User authenticated:", user.email); // Debug
      next();

    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError);
      res.status(403).json({ message: "Invalid or expired token" });
      return;
    }

  } catch (error) {
    console.error("Middleware error:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};