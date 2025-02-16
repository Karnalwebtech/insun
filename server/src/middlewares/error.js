"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const errorMiddleware = (err, req, res, next) => {
    let error = Object.assign({}, err);
    error.message = err.message;
    // Log error for debugging (consider using a proper logging library in production)
    console.error(err);
    // CastError - MongoDB not found
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid ${err.path}`;
        error = new errorHandler_1.default(message, 404);
    }
    // MongoDB duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        error = new errorHandler_1.default(message, 400);
    }
    // Wrong JWT error
    if (err.name === "JsonWebTokenError") {
        const message = "Token is invalid. Please log in again.";
        error = new errorHandler_1.default(message, 401);
    }
    // JWT expired error
    if (err.name === "TokenExpiredError") {
        const message = "Token has expired. Please log in again.";
        error = new errorHandler_1.default(message, 401);
    }
    res.status(error.statusCode || 500).json(Object.assign({ success: false, message: error.message || "Internal Server Error" }, (process.env.NODE_ENV === "development" && { stack: err.stack })));
};
exports.default = errorMiddleware;
