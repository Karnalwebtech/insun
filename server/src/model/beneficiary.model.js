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
const BeneficiarySchema = new mongoose_1.Schema({
    beneficiaryId: { type: String, required: true },
    policyId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Policy", required: true },
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    percentage: { type: Number, required: true, min: 0, max: 100 },
    contactNumber: { type: String, default: null },
    email: { type: String, default: null },
    address: { type: String, default: null },
    dateOfBirth: { type: Date, default: null },
    identificationNumber: { type: String, default: null },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE", "REMOVED"],
        default: "ACTIVE",
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Beneficiary", BeneficiarySchema);
