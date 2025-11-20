import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorMiddleware";

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { firstName, lastName, email, password } = req.body;

  const errors: Record<string, string> = {};

  if (!firstName || typeof firstName !== "string" || firstName.trim().length < 2) {
    errors.firstName = "First name is required and must be at least 2 characters";
  }

  if (!lastName || typeof lastName !== "string" || lastName.trim().length < 2) {
    errors.lastName = "Last name is required and must be at least 2 characters";
  }

  if (!email || typeof email !== "string" || !isValidEmail(email)) {
    errors.email = "Valid email is required";
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    errors.password = "Password is required and must be at least 6 characters";
  }

  if (Object.keys(errors).length > 0) {
    next(
      new AppError(
        `Validation failed: ${Object.values(errors).join(", ")}`,
        400,
        "VALIDATION_ERROR"
      )
    );
    return;
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;

  const errors: Record<string, string> = {};

  if (!email || typeof email !== "string" || !isValidEmail(email)) {
    errors.email = "Valid email is required";
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    errors.password = "Password is required";
  }

  if (Object.keys(errors).length > 0) {
    next(
      new AppError(
        `Validation failed: ${Object.values(errors).join(", ")}`,
        400,
        "VALIDATION_ERROR"
      )
    );
    return;
  }

  next();
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};
