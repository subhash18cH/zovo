import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const validateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token: string = req.cookies.jwt;
    if (!token) {
      res.status(401).json({ message: "UnAuthorized - No token provided" });
      return;
    }
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        console.log(err);
        return;
      }
      const { userId, email } = decoded as { userId: string; email: string };
      req.user = {
        email, userId
      };
      next();
    })
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Something went wrong" });
  }
}