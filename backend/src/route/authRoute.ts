import { Router } from "express";
import { AuthController } from "@/controller/authController.js";

export class AuthRoute {
  router: Router;
  private authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.routes();
  }

  private routes() {
    this.router.post("/register", this.authController.register);
    this.router.post("/login", this.authController.login);
    this.router.post("/logout", this.authController.logout);
    this.router.post("/refresh-token", this.authController.refreshToken);
  }
}
