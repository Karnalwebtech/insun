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
exports.encryptValue = encryptValue;
exports.decryptValue = decryptValue;
exports.genrateToken = genrateToken;
const crypto_js_1 = __importDefault(require("crypto-js"));
function encryptValue(value) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!value)
            return "";
        return crypto_js_1.default.AES.encrypt(value, process.env.SECRET_KEY).toString();
    });
}
function decryptValue(value) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!value)
            return "";
        const bytes = crypto_js_1.default.AES.decrypt(value, process.env.SECRET_KEY);
        return bytes.toString(crypto_js_1.default.enc.Utf8);
    });
}
function genrateToken() {
    return __awaiter(this, void 0, void 0, function* () {
        return crypto_js_1.default.lib.WordArray.random(32).toString(crypto_js_1.default.enc.Hex);
    });
}
