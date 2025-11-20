"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.loginUser = exports.registerUser = void 0;
const errorMiddleware_1 = require("../middleware/errorMiddleware");
const auth_service_1 = require("../services/auth.service");
/**
 * @desc Register a new user
 * @route POST /api/auth/register
 */
exports.registerUser = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const data = req.body;
    const result = await (0, auth_service_1.registerUserService)(data);
    res.status(201).json(result);
});
/**
 * @desc Login user
 * @route POST /api/auth/login
 */
exports.loginUser = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const data = req.body;
    const result = await (0, auth_service_1.loginUserService)(data);
    res.status(200).json(result);
});
/**
 * @desc Forgot password - send reset link
 * @route POST /api/auth/forgot-password
 */
exports.forgotPassword = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const data = req.body;
    const result = await (0, auth_service_1.forgotPasswordService)(data);
    res.status(200).json(result);
});
/**
 * @desc Reset password using token
 * @route POST /api/auth/reset-password
 */
exports.resetPassword = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const data = req.body;
    const result = await (0, auth_service_1.resetPasswordService)(data);
    res.status(200).json(result);
});
