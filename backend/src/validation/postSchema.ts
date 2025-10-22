import z from "zod";

export const getQuerySchema = z.object({
  page: z.string().optional().default("1").transform(Number),
  limit: z.string().optional().default("10").transform(Number),
  search: z.string().optional().default(""),
});

export const createPostSchema = z.object({
  title: z.string().min(1, "title required"),
  content: z.string().min(1, "content required"),
});

export const getIdParamsSchema = z
  .string()
  .uuid({ message: "invalid ID format" });


export const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional()
});
