import { AuthRoute } from "@/route/index.js";
import { PostRoute } from "@/route/index.js";
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler.js";
import cors from "cors";
import dotenv from 'dotenv';
import { config } from "./config/server.config.js";
dotenv.config();

export class App {
  app: Application;  

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
    const postRoute = new PostRoute();
    this.app.use("/auth", authRoute.router);
    this.app.use('/api', postRoute.router);
  }

  private errorMiddleware() {
    this.app.use(errorHandler);
  }

  run(){
    this.app.listen(config.port, () => {
      console.log(`server is running at http://localhost:${config.port}`);
    });
  }


}
