// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { asyncHandler } from "../middleware/errorMiddleware";
import {
  registerUserService,
  loginUserService,
  verifyUserService,
  resendVerificationService,
  forgotPasswordService,
  resetPasswordService,
} from "../services/auth.service";

import {
  RegisterDTO,
  LoginDTO,
  VerifyEmailDTO,
  ResendVerificationDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
} from "../dtos/auth.dto";

/**
 * @desc Register a new user
 * @route POST /api/auth/register
 */
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const data: RegisterDTO = req.body;
    const result = await registerUserService(data);
    res.status(201).json(result);
  }
);

/**
 * @desc Login user
 * @route POST /api/auth/login
 */
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const data: LoginDTO = req.body;
  const result = await loginUserService(data);
  res.status(200).json(result);
});

/**
 * @desc Verify user's email
 * @route POST /api/auth/verify
 */
export const verifyUser = asyncHandler(async (req: Request, res: Response) => {
  const data: VerifyEmailDTO = req.body;
  const result = await verifyUserService(data);
  res.status(200).json(result);
});

/**
 * @desc Resend verification email
 * @route POST /api/auth/resend-verification
 */
export const resendVerification = asyncHandler(
  async (req: Request, res: Response) => {
    const data: ResendVerificationDTO = req.body;
    const result = await resendVerificationService(data);
    res.status(200).json(result);
  }
);

/**
 * @desc Forgot password - send reset link
 * @route POST /api/auth/forgot-password
 */
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const data: ForgotPasswordDTO = req.body;
    const result = await forgotPasswordService(data);
    res.status(200).json(result);
  }
);

/**
 * @desc Reset password using token
 * @route POST /api/auth/reset-password
 */
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const data: ResetPasswordDTO = req.body;
    const result = await resetPasswordService(data);
    res.status(200).json(result);
  }
);
