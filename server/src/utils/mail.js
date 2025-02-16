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
exports.sendVerificationEmail = sendVerificationEmail;
exports.sendNewPassword = sendNewPassword;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_MAIL_HOST,
    //   port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_MAIL_USER,
        pass: process.env.SMTP_MAIL_PASS,
    },
});
function sendVerificationEmail(email, otp) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield transporter.sendMail({
                from: process.env.SMTP_FROM,
                to: email,
                subject: "Verify your email address",
                html: `
        <div>
          <h1>Verify your email address</h1>
          <p>Click the link below to verify your email address:</p>
          <p>${otp}</p>
        </div>
      `,
            });
            return true;
        }
        catch (error) {
            console.error("Email sending failed:", error);
            return false; // Return false if sending failed
        }
    });
}
function sendNewPassword(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield transporter.sendMail({
                from: process.env.SMTP_FROM,
                to: email,
                subject: "Your New Password",
                text: `Hello,\n\nYour new password is: ${password}\n\nPlease change it after logging in.\n\nBest Regards,\nYour Company`,
            });
            return true;
        }
        catch (error) {
            console.error("Failed to send verification email:", error);
            return false; // Return false if sending failed
        }
    });
}
