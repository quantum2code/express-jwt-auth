import { ErrorRequestHandler } from "express";
import { z } from "zod";
import AppError from "../utils/AppError";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  //show the error path of every error
  console.log(`REQUEST_PATH: ${req.path}\n`, error);

  //Zod errors
  if (error instanceof z.ZodError) {
    res.status(400).json({
      message: error.issues.map((issue) => ({
        path: issue.path.join(" - "),
        issue: issue.message,
      })),
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
    });
  }

  //if no ecxeptions fallback to 500 internal server error
  res.status(500).json({ message: "internal server error" });
  return;
};
