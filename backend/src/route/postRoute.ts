import { Router } from "express";
import { PostController } from "@/controller/postController.js";
import { AuthMiddleware } from "@/middleware/authMiddleware.js";
import { RoleMiddleware } from "@/middleware/roleMiddleware.js";

export class PostRoute {
  router: Router;
  private postController: PostController;
  private authMiddleware: AuthMiddleware;
  private roleMiddleware: RoleMiddleware;

  constructor() {
    this.router = Router();
    this.postController = new PostController();
    this.authMiddleware = new AuthMiddleware();
    this.roleMiddleware = new RoleMiddleware();
    this.routes();
  }

  private routes() {
    this.router.post(
      "/post",
      this.authMiddleware.authenticate,
      this.roleMiddleware.checkRole("ADMIN", "AUTHOR"),
      this.postController.createPost
    );

    //public access
    this.router.get("/post", this.postController.getAllPosts);
    this.router.get("/post/:id", this.postController.getPostById);

    this.router.patch(
      "/post/:id",
      this.authMiddleware.authenticate,
      this.roleMiddleware.checkRole("ADMIN", "AUTHOR")
    );

    this.router.delete(
      "/post/:id",
      this.authMiddleware.authenticate,
      this.roleMiddleware.checkRole("ADMIN", "AUTHOR")
    );
  }
}
