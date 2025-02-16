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
exports.login = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const cryptoChanger_1 = require("../../utils/cryptoChanger");
const otpGenerator_1 = require("../../utils/otpGenerator");
const user_model_1 = require("../../model/user.model");
const errorHandler_1 = __importDefault(require("../../utils/errorHandler"));
const otpModel_1 = require("../../model/otpModel");
const mail_1 = require("../../utils/mail");
const uuidGenrator_1 = __importDefault(require("../../utils/uuidGenrator"));
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Registering user", req.body);
    const { name, email, password, phone, image, provider } = req.body;
    if (!name || !email || !password) {
        return next(new errorHandler_1.default("All fields are required.", 400));
    }
    const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
    if (!isValidEmail(email)) {
        return next(new errorHandler_1.default("Invalid email format.", 400));
    }
    if (phone) {
        const isValidPhoneNumber = (phone) => /^\d{10}$/.test(phone);
        if (!isValidPhoneNumber(phone)) {
            return next(new errorHandler_1.default("Phone number must be exactly 10 digits.", 400));
        }
    }
    const Email = email.toLowerCase();
    try {
        const existingUser = yield user_model_1.User.findOne({ email: Email });
        const verifyToken = yield (0, cryptoChanger_1.genrateToken)();
        const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        const otp = yield (0, otpGenerator_1.OTPGenerator)(6);
        if (existingUser) {
            console.log(existingUser);
            if (existingUser.isVerified) {
                return next(new errorHandler_1.default("Email already exists", 400));
            }
            else {
                existingUser.name = name;
                existingUser.verifyToken = verifyToken;
                existingUser.verifyTokenExpiry = verifyTokenExpiry;
                existingUser.phoneNumber = phone;
                existingUser.provider = provider;
                existingUser.image = image && image !== "" ? image : null;
                yield existingUser.save();
                yield otpModel_1.OTPModel.findOneAndUpdate({ userId: existingUser._id }, { otpCode: Number(otp), token: verifyToken }, { upsert: true });
                const mailresponse = yield (0, mail_1.sendVerificationEmail)(email, Number(otp));
                if (!mailresponse) {
                    return next(new errorHandler_1.default("Failed to send verification email", 500));
                }
                res.status(200).json({
                    message: "OTP has been sent.",
                    success: true,
                    token: verifyToken,
                });
                return;
            }
        }
        const userCount = yield user_model_1.User.countDocuments();
        const userId = (0, uuidGenrator_1.default)();
        const newUserId = `user_${name.slice(0, 3)}-${userId}-${userCount}`;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = new user_model_1.User({
            userId: newUserId,
            name,
            phoneNumber: phone,
            email: Email,
            password: hashedPassword,
            verifyToken,
            provider: provider || null,
            verifyTokenExpiry,
            image: image && image !== "" ? image : null,
            isVerified: false,
        });
        yield newUser.save();
        yield otpModel_1.OTPModel.create({
            userId: newUser._id,
            email: newUser.email,
            token: verifyToken,
            otpCode: Number(otp),
        });
        const mailresponse = yield (0, mail_1.sendVerificationEmail)(email, Number(otp));
        if (!mailresponse) {
            return next(new errorHandler_1.default("Failed to send verification email", 500));
        }
        res.status(201).json({
            message: "User created successfully. Please verify your email.",
            success: true,
            token: verifyToken,
        });
    }
    catch (error) {
        console.error(error);
        return next(new errorHandler_1.default("An unknown error occurred", 500));
    }
});
exports.registerUser = registerUser;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new errorHandler_1.default("All fields are required.", 400));
    }
    const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
    if (!isValidEmail(email)) {
        return next(new errorHandler_1.default("Invalid email format.", 400));
    }
    const Email = email.toLowerCase();
    try {
        const existingUser = yield user_model_1.User.findOne({ email: Email });
        if (!existingUser) {
            return next(new errorHandler_1.default("No user found with this email", 400));
        }
        if (!existingUser.isVerified) {
            return next(new errorHandler_1.default("No user found with this email", 400));
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return next(new errorHandler_1.default("Incorrect password", 400));
        }
        if (existingUser.role !== "admin") {
            return next(new errorHandler_1.default("Please contact to admin", 400));
        }
        res.status(201).json({
            message: "User clogin successfully.",
            success: true,
            user: existingUser,
        });
    }
    catch (error) {
        console.error(error);
        return next(new errorHandler_1.default("An unknown error occurred", 500));
    }
});
exports.login = login;
