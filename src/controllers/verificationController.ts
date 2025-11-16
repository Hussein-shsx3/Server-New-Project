import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import User from "../models/User";
import { EmailService } from "../services/emailService";
import { asyncHandler, AppError } from "../middleware/errorMiddleware";

const emailService = new EmailService();

// @desc    Send verification email
// @route   POST /api/auth/send-verification
// @access  Private
export const sendVerificationEmail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.isEmailVerified) {
      throw new AppError("Email is already verified", 400);
    }

    // Generate verification token
    const verificationToken = emailService.generateVerificationToken();

    // Hash and save token to database
    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await user.save();

    // Send email
    try {
      await emailService.sendVerificationEmail(
        user.email,
        user.name,
        verificationToken
      );

      res.status(200).json({
        success: true,
        message: "Verification email sent successfully",
      });
    } catch (error) {
      // Clear token if email fails
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      throw new AppError("Failed to send verification email", 500);
    }
  }
);

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;

    if (!token) {
      throw new AppError("Verification token is required", 400);
    }

    // Hash the token from URL
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    }).select("+emailVerificationToken +emailVerificationExpires");

    if (!user) {
      throw new AppError("Invalid or expired verification token", 400);
    }

    // Verify email
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(user.email, user.name);
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      // Don't throw error, email is already verified
    }

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
        },
      },
    });
  }
);

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      throw new AppError("Email is required", 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists
      res.status(200).json({
        success: true,
        message: "If email exists, password reset link has been sent",
      });
      return;
    }

    // Generate reset token
    const resetToken = emailService.generateVerificationToken();

    // Hash and save token
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // Send email
    try {
      await emailService.sendPasswordResetEmail(
        user.email,
        user.name,
        resetToken
      );

      res.status(200).json({
        success: true,
        message: "Password reset link sent to email",
      });
    } catch (error) {
      // Clear token if email fails
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      throw new AppError("Failed to send password reset email", 500);
    }
  }
);

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      throw new AppError("Reset token is required", 400);
    }

    if (!password) {
      throw new AppError("Password is required", 400);
    }

    if (password.length < 6) {
      throw new AppError("Password must be at least 6 characters", 400);
    }

    // Hash the token from URL
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      throw new AppError("Invalid or expired reset token", 400);
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshToken = undefined; // Clear refresh token for security
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully. Please login with new password.",
    });
  }
);

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerificationEmail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      throw new AppError("Email is required", 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists
      res.status(200).json({
        success: true,
        message: "If email exists, verification link has been sent",
      });
      return;
    }

    if (user.isEmailVerified) {
      throw new AppError("Email is already verified", 400);
    }

    // Generate new verification token
    const verificationToken = emailService.generateVerificationToken();

    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    // Send email
    try {
      await emailService.sendVerificationEmail(
        user.email,
        user.name,
        verificationToken
      );

      res.status(200).json({
        success: true,
        message: "Verification email sent successfully",
      });
    } catch (error) {
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      throw new AppError("Failed to send verification email", 500);
    }
  }
);
