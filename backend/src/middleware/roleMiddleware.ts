import { ResponseError } from "@/util/responseError.js";
import { Response, Request, NextFunction } from "express";

export class RoleMiddleware {
  checkRole(...allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.user) {
          throw new ResponseError(401, "User not authorizated");
        }

        if (!allowedRoles.includes(req.user.role)) {
          throw new ResponseError(401, "User does not have access");
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
