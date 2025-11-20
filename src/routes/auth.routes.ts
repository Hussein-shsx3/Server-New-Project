// src/routes/auth.routes.ts
import { Router } from "express";
import {
  registerUser,
  loginUser,
  verifyUser,
  resendVerification,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller";
import { validateRegister, validateLogin } from "../middleware/validateRequest";

const router = Router();

// Public routes
router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.post("/verify", verifyUser);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
