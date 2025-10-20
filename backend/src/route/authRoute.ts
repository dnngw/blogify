import { Router } from "express";
import { AuthController } from "@/controller/authController.js";

export class AuthRoute {
  public router: Router;
  private authController: AuthController;

  constructor(){
    this.router = Router();
    this.authController = new AuthController();
    this.routes();

  }

  private routes(){
    this.router.post('/register', this.authController.register);
  }
}