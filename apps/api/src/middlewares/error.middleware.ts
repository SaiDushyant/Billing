import { NextFunction, Request, Response } from "express";

export function errorMiddleware(
  error: any,
  _: Request,
  res: Response,
  __: NextFunction,
) {
  console.error(error);

  return res.status(500).json({
    message: error.message || "Internal server error",
  });
}
