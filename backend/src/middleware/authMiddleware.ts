import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ResponseError } from "@/util/responseError.js";
import { AuthUser } from "@/interface/index.js";
dotenv.config();

export class AuthMiddleware {
  authenticate() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = req.header("Authorization")?.replace("Bearer", "");

        if (!token) {
          throw new ResponseError(401, "token not valid");
        }

        const decoded = jwt.verify(
          token,
          process.env.JWT_ACCESS_SECRET!
        ) as AuthUser;

        req.user = decoded;

        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
