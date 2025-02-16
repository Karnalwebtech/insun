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
// Define the image schema
const fileSchema = new mongoose_1.default.Schema({
    no: {
        type: Number,
        default: 0,
    },
    originalname: {
        type: String,
        default: null,
    },
    encoding: {
        type: String,
        default: null,
    },
    filename: {
        type: String,
        default: null,
    },
    fieldname: {
        type: String,
        default: null,
    },
    path: {
        type: String,
        default: null,
    },
    size: {
        type: Number,
        default: null,
    },
    altText: {
        type: String,
        default: null,
    },
    title: {
        type: String,
        default: null,
    },
    caption: {
        type: String,
        default: null,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    is_active: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});
// Create and export the Image model
const fileModel = mongoose_1.default.model("File", fileSchema);
exports.default = fileModel;
