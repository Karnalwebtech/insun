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
// Define the schema
const customerSchema = new mongoose_1.default.Schema({
    no: { type: Number, default: 0 },
    id: { type: String, default: null },
    fullname: { type: String, default: null },
    policy_no: { type: String, default: null },
    phone: { type: Number, default: null },
    dop: { type: String, default: null },
    dor: { type: String, default: null },
    issue_policy_year: { type: String, default: null },
    si: { type: String, default: null },
    amount: { type: Number, default: 0 },
    email: { type: String, default: null }, // Fixed 'string' to 'String'
    category: { type: String, default: null }, // Fixed
    health_conditions: { type: String, default: null }, // Fixed
    addhar_card: { type: mongoose_1.Schema.Types.ObjectId, ref: "File" }, // Change ref if needed
    pan_card: { type: mongoose_1.Schema.Types.ObjectId, ref: "File" }, // Change ref if needed
    document: { type: mongoose_1.Schema.Types.ObjectId, ref: "File" }, // Change ref if needed
    profile_image: { type: mongoose_1.Schema.Types.ObjectId, ref: "File" }, // Change ref if needed
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    is_active: { type: Boolean, default: true }, // Changed from `isActive` to `is_active` for consistency
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});
// Create the model
const CustomerModel = mongoose_1.default.model("Customer", customerSchema);
exports.default = CustomerModel;
