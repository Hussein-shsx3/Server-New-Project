"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateRegister = void 0;
const errorMiddleware_1 = require("./errorMiddleware");
const validateRegister = (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    const errors = {};
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
        next(new errorMiddleware_1.AppError(`Validation failed: ${Object.values(errors).join(", ")}`, 400, "VALIDATION_ERROR"));
        return;
    }
    next();
};
exports.validateRegister = validateRegister;
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = {};
    if (!email || typeof email !== "string" || !isValidEmail(email)) {
        errors.email = "Valid email is required";
    }
    if (!password || typeof password !== "string" || password.length < 6) {
        errors.password = "Password is required";
    }
    if (Object.keys(errors).length > 0) {
        next(new errorMiddleware_1.AppError(`Validation failed: ${Object.values(errors).join(", ")}`, 400, "VALIDATION_ERROR"));
        return;
    }
    next();
};
exports.validateLogin = validateLogin;
const isValidEmail = (email) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
};
