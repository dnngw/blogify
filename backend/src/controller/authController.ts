import { Request, Response, NextFunction } from "express";
import prisma from "../config/database.js";
import bcrypt from "bcrypt";
import { registerSchema } from "../validation/authSchema.js";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerSchema.parse(req.body);
      const { username, email, fullName, password } = data;

      const userCheck = await prisma.user.findFirst({
        where: {
          OR: [{ username: username }, { email: email }],
        },
      });

      if (userCheck) {
        return res.status(409).json({
          success: false,
          message: "Username or email already exist",
        });
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const result = await prisma.user.create({
        data: {
          username: username,
          email: email,
          fullName: fullName,
          password: hashPassword,
        },
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
        },
      });

      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  
}
