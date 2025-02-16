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
exports.authorizeRoles = exports.secureApi = exports.isAuthenticatedUser = void 0;
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const user_model_1 = require("../model/user.model");
const cryptoChanger_1 = require("../utils/cryptoChanger");
const isAuthenticatedUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authorization = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]) || "";
    if (!authorization) {
        return next(new errorHandler_1.default("Please log in first", 400));
    }
    try {
        const token = yield (0, cryptoChanger_1.decryptValue)(authorization);
        const user = yield user_model_1.User.findOne({ "email": token });
        if (!user) {
            return next(new errorHandler_1.default("You are not authorization", 404));
        }
        req.user = user;
        next();
    }
    catch (error) {
        return next(new errorHandler_1.default(`Invalid token. Please log in again. ${error}`, 401));
    }
});
exports.isAuthenticatedUser = isAuthenticatedUser;
const secureApi = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const apikey = req.headers["x-api-key"] || "";
    try {
        const decodeapikey = yield (0, cryptoChanger_1.decryptValue)(apikey);
        if (decodeapikey !== process.env.API_KEY) {
            return next(new errorHandler_1.default("Api key is not valid", 404));
        }
        next();
    }
    catch (error) {
        return next(new errorHandler_1.default(`Invalid token. Please log in again. ${error}`, 401));
    }
});
exports.secureApi = secureApi;
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        var _a;
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new errorHandler_1.default(`Role: ${(_a = req.user) === null || _a === void 0 ? void 0 : _a.role} is not allowed to access this resource`, 403));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
