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
exports.resetPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../../model/user.model");
const errorHandler_1 = __importDefault(require("../../utils/errorHandler"));
const generatePassword_1 = require("../../utils/generatePassword");
const mail_1 = require("../../utils/mail");
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            return next(new errorHandler_1.default("User not found with this email.", 404));
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const password = yield (0, generatePassword_1.generatePassword)();
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        user.password = hashedPassword;
        yield user.save();
        const mailResponse = yield (0, mail_1.sendNewPassword)(email, password);
        if (!mailResponse) {
            return next(new errorHandler_1.default("Failed to send password", 500));
        }
        res.status(201).json({ success: true, message: "New password sent successfully." });
    }
    catch (err) {
        return next(new errorHandler_1.default("An unknown error occurred", 500));
    }
});
exports.resetPassword = resetPassword;
