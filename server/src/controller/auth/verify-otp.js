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
exports.verifyOTP = void 0;
const otpModel_1 = require("../../model/otpModel");
const user_model_1 = require("../../model/user.model");
const errorHandler_1 = __importDefault(require("../../utils/errorHandler"));
const MAX_ATTEMPTS = 5;
const verifyOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otpValue, token } = req.body;
        if (!otpValue || !token) {
            return next(new errorHandler_1.default("OTP and token are required", 400));
        }
        // Find the most recent OTP record for the given token
        const otpRecord = yield otpModel_1.OTPModel.findOne({ token })
            .sort({ createdAt: -1 })
            .exec();
        if (!otpRecord) {
            return next(new errorHandler_1.default("Invalid token", 404));
        }
        if (otpRecord.expiresAt < new Date()) {
            return next(new errorHandler_1.default("OTP has expired", 410));
        }
        if (otpRecord.isVerified) {
            return next(new errorHandler_1.default("OTP has already been verified", 400));
        }
        if (!otpRecord.attempts) {
            otpRecord.attempts = 0;
        }
        if (otpRecord.attempts >= MAX_ATTEMPTS) {
            return next(new errorHandler_1.default("Too many failed attempts. Please request a new OTP.", 429));
        }
        if (otpRecord.otpCode !== Number(otpValue)) {
            otpRecord.attempts += 1;
            yield otpRecord.save();
            res.status(400).json({
                message: "Invalid OTP",
                attemptsLeft: MAX_ATTEMPTS - otpRecord.attempts,
            });
            return;
        }
        // OTP is valid, update records
        otpRecord.isVerified = true;
        otpRecord.attempts = 0;
        yield otpRecord.save();
        const user = yield user_model_1.User.findOneAndUpdate({ verifyToken: token }, { $set: { isVerified: true } }, { new: true });
        if (!user) {
            return next(new errorHandler_1.default("User not found", 404));
        }
        // Invalidate all previous OTPs for this token
        yield otpModel_1.OTPModel.updateMany({ token, _id: { $ne: otpRecord._id } }, { $set: { isVerified: true, attempts: MAX_ATTEMPTS } });
        res.status(200).json({
            message: "OTP verified successfully",
            accessToken: token,
        });
    }
    catch (error) {
        console.error("OTP verification error:", error);
        return next(new errorHandler_1.default("An error occurred during OTP verification", 500));
    }
});
exports.verifyOTP = verifyOTP;
