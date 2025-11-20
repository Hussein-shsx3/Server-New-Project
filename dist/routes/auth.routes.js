"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.routes.ts
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validateRequest_1 = require("../middleware/validateRequest");
const router = (0, express_1.Router)();
// Public routes
router.post("/register", validateRequest_1.validateRegister, auth_controller_1.registerUser);
router.post("/login", validateRequest_1.validateLogin, auth_controller_1.loginUser);
router.post("/verify", auth_controller_1.verifyUser);
router.post("/resend-verification", auth_controller_1.resendVerification);
router.post("/forgot-password", auth_controller_1.forgotPassword);
router.post("/reset-password", auth_controller_1.resetPassword);
exports.default = router;
