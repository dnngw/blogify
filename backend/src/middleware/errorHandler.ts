import { Request, Response, NextFunction } from "express";
import { ResponseError } from "../util/responseError.js";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {

  // costum error using Response Error
  if (error instanceof ResponseError) {
    return res.status(error.status).json({
      success: false,
      message: error.message,
    });
  }

  // default error
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};
