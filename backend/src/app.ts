import { AuthRoute } from "@/route/index.js";
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler.js";
import cors from "cors";
import dotenv from 'dotenv';
import { config } from "./config/server.config.js";
dotenv.config();

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.middleware();
    this.initializeRoutes();
    this.errorMiddleware();
  }

  private middleware() {
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(cors());
  }

  private initializeRoutes() {
    const authRoute = new AuthRoute();
    this.app.use("/auth", authRoute.router);
  }

  private errorMiddleware() {
    this.app.use(errorHandler);
  }

  public run(){
    this.app.listen(config.port, () => {
      console.log(`server is running at http://localhost:${config.port}`);
    });
  }


}
