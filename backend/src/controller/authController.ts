import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database.js";
import bcrypt from "bcrypt";
import { loginSchema, registerSchema } from "@/validation/authSchema.js";
import { ResponseError } from "@/util/responseError.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

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
        throw new ResponseError(409, "Username or email already exist");
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

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginSchema.parse(req.body);
      const { username, password } = data;

      const checkUser = await prisma.user.findUnique({
        where: { username: username },
      });

      if (!checkUser) {
        throw new ResponseError(401, "username invalid");
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        checkUser.password
      );

      if (!isPasswordValid) {
        throw new ResponseError(301, "password invalid");
      }

      const accessToken = jwt.sign(
        {
          id: checkUser.id,
          username: checkUser.username,
          email: checkUser.email,
          role: checkUser.role,
        },
        process.env.JWT_ACCESS_SECRET!,
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        {
          id: checkUser.id,
          username: checkUser.username,
          email: checkUser.email,
          role: checkUser.role,
        },
        process.env.JWT_ACCESS_SECRET!,
        { expiresIn: "7d" }
      );

      await prisma.user.update({
        where: { id: checkUser.id },
        data: {
          refreshToken: refreshToken,
        },
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        data: {
          accessToken: accessToken
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
