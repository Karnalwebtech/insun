"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    provider: { type: String, default: null },
    image: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    verifyToken: String,
    verifyTokenExpiry: Date,
    role: { type: String, enum: ["user", "admin", "agent"], default: "user" },
    dashboard: {
        type: String,
        enum: ["user", "admin", "agent"],
        default: "user",
    },
    dateOfBirth: Date,
    phoneNumber: { type: String },
    address: { type: mongoose_1.Schema.Types.ObjectId },
    socialMediaProfiles: [
        {
            platform: {
                type: String,
                enum: ["facebook", "twitter", "linkedin", "instagram"],
            },
            url: { type: String },
        },
    ],
    lastLogin: { type: Date },
    is2FAEnabled: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date,
    permissions: [
        { type: String, enum: ["read", "write", "delete", "update"] },
    ],
    subscriptionPlan: {
        type: String,
        enum: ["basic", "premium", "enterprise"],
    },
    isProfileComplete: { type: Boolean, default: false },
    activityLog: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "UserActivity" }],
    preferences: {
        language: { type: String, default: "en" },
        notifications: { type: Boolean, default: true },
    },
    isAccountLocked: { type: Boolean, default: false },
    deactivatedAt: Date,
    referralCode: String,
    securityQuestions: [
        {
            question: { type: String },
            answer: { type: String },
        },
    ],
}, { timestamps: true });
// Check if the model already exists before defining it
exports.User = mongoose_1.default.models.User || mongoose_1.default.model("User", UserSchema);
