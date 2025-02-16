"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const otpSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users", // Link to User model
    },
    email: {
        type: String,
        default: null,
    },
    otpCode: {
        type: Number,
        required: true,
        select: true,
    },
    token: {
        type: String,
        default: null,
    },
    purpose: {
        type: String,
        enum: ["account_verification", "password_reset"],
    },
    isVerified: {
        type: Boolean,
        default: false, // OTP status
    },
    attempts: {
        type: Number,
        default: 0, // Track failed attempts
    },
    expiresAt: { type: Date, required: true, default: () => new Date(Date.now() + 10 * 60 * 1000) }
}, { timestamps: true });
exports.OTPModel = mongoose_1.default.models.Otp || mongoose_1.default.model("Otp", otpSchema);
