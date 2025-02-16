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
const PolicySchema = new mongoose_1.Schema({
    policyNumber: { type: String, required: true, unique: true },
    policyHolder: { type: mongoose_1.Schema.Types.ObjectId, ref: "PolicyHolder", required: true },
    coverageAmount: { type: Number, required: true },
    premiumAmount: { type: Number, required: true },
    premiumPaymentFrequency: { type: String, enum: ["monthly", "quarterly", "annually"], required: true },
    policyType: { type: String, enum: ["life", "health", "vehicle", "home"], required: true },
    term: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ["active", "expired", "cancelled"], default: "active" },
    beneficiaries: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Beneficiary", required: true }],
    termsAndConditions: { type: String },
    isRenewable: { type: Boolean, default: true },
    nextRenewalDate: { type: Date },
    underwritingDetails: { type: String },
    premiumHistory: [{
            amountPaid: { type: Number, required: true },
            paymentDate: { type: Date, required: true },
            paymentMethod: { type: String, enum: ["credit_card", "debit_card", "bank_transfer", "cash"], required: true },
            paymentStatus: { type: String, enum: ["successful", "failed", "pending"], required: true },
        }],
    claimsHistory: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Claim" }],
    discounts: [{
            discountCode: { type: String, required: true },
            discountAmount: { type: Number, required: true },
            reason: { type: String, required: true },
            appliedAt: { type: Date, default: Date.now }
        }],
    alternateContact: {
        name: { type: String },
        relationship: { type: String },
        contactNumber: { type: String },
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model("Policy", PolicySchema);
