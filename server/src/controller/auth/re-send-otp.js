"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendOTP = void 0;
const otpModel_1 = require("../../model/otpModel");
const errorHandler_1 = __importDefault(require("../../utils/errorHandler"));
const otpGenerator_1 = require("../../utils/otpGenerator");
const mail_1 = require("../../utils/mail");
const resendOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        const OtpToken = yield otpModel_1.OTPModel.findOne({ token: token }).sort({
            updated_at: -1,
        });
        if (!OtpToken || !OtpToken.email) {
            return next(new errorHandler_1.default("Invalid or expired token.", 400));
        }
        const otp = yield (0, otpGenerator_1.OTPGenerator)(6);
        const otpdata = {
            userId: OtpToken.userId,
            email: OtpToken.email,
            token,
            otpCode: Number(otp),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiration
        };
        yield otpModel_1.OTPModel.create(otpdata);
        // Resend OTP email
        const mailresponse = yield (0, mail_1.sendVerificationEmail)(OtpToken.email, Number(otp));
        if (!mailresponse) {
            return next(new errorHandler_1.default("Failed to send verification email", 500));
        }
        res.status(201).json({ message: "OTP resend successfully." });
    }
    catch (err) {
        console.error(err);
        return next(new errorHandler_1.default("An unknown error occurred", 500));
    }
});
exports.resendOTP = resendOTP;
