import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../constants";

export default function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const statusCode = HttpStatusCode.INTERNAL_SERVER;
  const response = {
    message: error.message,
  };

  res.status(statusCode).json(response);
}
