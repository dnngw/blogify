import {
  createPostSchema,
  getIdParamsSchema,
  getQuerySchema,
  updatePostSchema,
} from "@/validation/postSchema.js";
import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database.js";
import { ResponseError } from "@/util/responseError.js";

export class PostController {
  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createPostSchema.parse(req.body);
      const userId = req.user.id;

      const result = await prisma.post.create({
        data: {
          title: data.title,
          content: data.content,
          authorId: userId,
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              fullName: true,
            },
          },
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

  async getAllPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search } = getQuerySchema.parse(req.query);
      const userId = req.user.id;

      const skip = (page - 1) * limit;

      const where: any = {};

      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ];
      }

      if (userId) {
        where.authorId = userId;
      }

      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where,
          skip,
          take: limit,
          include: {
            author: {
              select: {
                id: true,
                username: true,
                fullName: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        }),

        prisma.post.count({ where }),
      ]);

      return res.status(200).json({
        success: true,
        data: posts,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getPostById(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = getIdParamsSchema.parse(req.params);

      const result = await prisma.post.findFirst({
        where: {
          id: postId,
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              fullName: true,
            },
          },
        },
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async postUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, content } = updatePostSchema.parse(req.body);
      const postId = getIdParamsSchema.parse(req.params);
      const user = req.user;

      const post = await prisma.post.findUnique({
        where: {
          id: user.id,
        },
      });

      if (!post) {
        throw new ResponseError(404, "data not found");
      }

      if (post.authorId !== user.id && user.role !== "ADMIN") {
        throw new ResponseError(403, "Forbidden");
      }

      const updateData: any = {};

      if (title) {
        updateData.title = title;
      }

      if (content) {
        updateData.content = content;
      }

      const result = await prisma.post.update({
        where: {
          id: postId,
        },
        data: updateData,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              fullName: true,
            },
          },
        },
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = getIdParamsSchema.parse(req.params);
      const user = req.user;

      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (!post) {
        throw new ResponseError(404, "data not found");
      }

      if (post.authorId !== user.id && user.role !== "ADMIN") {
        throw new ResponseError(403, "Forbidden");
      }

      const result = await prisma.post.delete({
        where: {
          id: postId,
        },
      });

      res.status(200).json({
        success: true,
        message: 'delete successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
