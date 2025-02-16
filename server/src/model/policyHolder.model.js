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
const mongoose_1 = __importStar(require("mongoose"));
const PolicyHolderSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    address: { type: mongoose_1.Schema.Types.ObjectId, ref: "Address", required: true },
    phone: { type: String, required: true },
    alternatePhone: { type: String },
    email: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    nationality: { type: String },
    bloodType: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },
    healthConditions: [{ type: String, required: true }],
    disabilityStatus: { type: Boolean },
    languagesSpoken: [{ type: String }],
    hobbies: [{ type: String }],
    emergencyContact: {
        name: { type: String, required: true },
        relationship: { type: String, required: true },
        phone: { type: String, required: true },
    },
    preferredCommunication: {
        type: String,
        enum: ["email", "phone", "text"],
        required: true,
    },
    occupation: { type: String },
    policyHistory: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Policy" }],
    maritalStatus: {
        type: String,
        enum: ["single", "married", "divorced", "widowed"],
        required: true,
    },
    insuranceTypes: [
        {
            type: String,
            enum: ["health", "life", "home", "auto"],
            required: true,
        },
    ],
    memberId: { type: String, required: true, unique: true },
    consentToTerms: { type: Boolean, default: false },
    paymentMethod: {
        type: String,
        enum: ["credit_card", "debit_card", "bank_transfer", "cash"],
    },
    socialMediaProfiles: [
        {
            platform: {
                type: String,
                enum: ["facebook", "twitter", "linkedin", "instagram"],
                required: true,
            },
            url: { type: String, required: true },
        },
    ],
    claimsHistory: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Claim" }],
    notes: { type: String },
}, { timestamps: true });
exports.default = mongoose_1.default.model("PolicyHolder", PolicyHolderSchema);
