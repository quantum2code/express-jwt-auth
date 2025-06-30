import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log(`REQUEST_PATH: ${req.path}\n`, error);
  res.status(500).json({ message: "internal server error" });
};
