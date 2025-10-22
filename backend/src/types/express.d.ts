import { AuthUser } from "@/interface/index.ts";

declare global {
  namespace Express {
    interface Request {
      user: AuthUser
    }
  }
}

export {};