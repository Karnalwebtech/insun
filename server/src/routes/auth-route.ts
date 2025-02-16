import { Router } from "express";
import { secureApi } from "../middlewares/authMiddleware";
import { registerUser } from "../controller/auth/auth-controller";
import { resendOTP } from "../controller/auth/re-send-otp";
import { verifyOTP } from "../controller/auth/verify-otp";
import { resetPassword } from "../controller/auth/forgot-password";
const router = Router();

router.post("/auth/register", secureApi, registerUser);

router.post("/auth/resend-otp", secureApi, resendOTP);
router.post("/auth/verify-otp", secureApi, verifyOTP);
router.post("/auth/forgot-password", secureApi, resetPassword);


export default router;
