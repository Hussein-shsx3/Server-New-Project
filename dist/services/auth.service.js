"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordService = exports.forgotPasswordService = exports.loginUserService = exports.registerUserService = void 0;
const user_model_1 = require("../models/user.model");
const errorMiddleware_1 = require("../middleware/errorMiddleware");
const generateToken_1 = require("../utils/generateToken");
const sendEmail_1 = require("../utils/sendEmail");
const emailTemplate_1 = require("../utils/emailTemplate");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * Register a new user
 */
const registerUserService = async (data) => {
    const { firstName, lastName, email, password } = data;
    console.log("Register service - Received:", { firstName, lastName, email, password: "***" });
    // Check if user already exists
    const existingUser = await user_model_1.User.findOne({ email });
    if (existingUser) {
        console.log("User already exists:", email);
        throw new errorMiddleware_1.AppError("Email already exists", 400, "DUPLICATE_KEY");
    }
    // Create the user with isVerified = true (no email verification needed)
    console.log("Creating new user...");
    const user = await user_model_1.User.create({
        firstName,
        lastName,
        email,
        password,
        isVerified: true // Set to true immediately - no email verification required
    });
    console.log("User created successfully:", user._id);
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    console.log("Registration completed successfully");
    return {
        success: true,
        message: "Registration successful! You can now login.",
        token,
        user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isVerified: true,
        },
    };
};
exports.registerUserService = registerUserService;
/**
 * Login user and generate JWT
 */
const loginUserService = async (data) => {
    const { email, password } = data;
    const user = await user_model_1.User.findOne({ email }).select("+password");
    if (!user)
        throw new errorMiddleware_1.AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
        throw new errorMiddleware_1.AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    return {
        success: true,
        token,
        user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        },
    };
};
exports.loginUserService = loginUserService;
/**
 * Forgot password - send reset email
 */
const forgotPasswordService = async (data) => {
    const { email } = data;
    const user = await user_model_1.User.findOne({ email });
    if (!user)
        throw new errorMiddleware_1.AppError("User not found", 404, "USER_NOT_FOUND");
    const { token, expires } = (0, generateToken_1.generateToken)(32, 1); // 1 hour
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const url = `${frontendUrl}/reset-password?token=${token}`;
    const html = (0, emailTemplate_1.generateEmailTemplate)(user.firstName, url, "reset");
    try {
        await (0, sendEmail_1.sendEmail)(user.email, "Reset Your WanderWise Password", html);
    }
    catch (emailError) {
        console.error("Email sending failed:", emailError);
    }
    return { success: true, message: "Password reset email sent" };
};
exports.forgotPasswordService = forgotPasswordService;
/**
 * Reset password using token
 */
const resetPasswordService = async (data) => {
    const { token, newPassword } = data;
    const user = await user_model_1.User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() },
    }).select("+password");
    if (!user)
        throw new errorMiddleware_1.AppError("Reset token is invalid or expired", 400, "INVALID_TOKEN");
    // 🔥 Compare new password with old one
    const isSamePassword = await bcryptjs_1.default.compare(newPassword, user.password);
    if (isSamePassword) {
        throw new errorMiddleware_1.AppError("New password cannot be the same as the old password", 400, "SAME_PASSWORD");
    }
    // Update password
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    return { success: true, message: "Password reset successfully" };
};
exports.resetPasswordService = resetPasswordService;
