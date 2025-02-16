import { Request, Response, NextFunction } from "express";
import { OTPModel } from "../../model/otpModel";
import ErrorHandler from "../../utils/errorHandler";
import { OTPGenerator } from "../../utils/otpGenerator";
import { sendVerificationEmail } from "../../utils/mail";

export const resendOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;

    const OtpToken = await OTPModel.findOne({ token: token }).sort({
      updated_at: -1,
    });

    if (!OtpToken || !OtpToken.email) {
      return next(new ErrorHandler("Invalid or expired token.", 400));
    }

    const otp: string = await OTPGenerator(6);
    const otpdata = {
      userId: OtpToken.userId,
      email: OtpToken.email,
      token,
      otpCode: Number(otp),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiration
    };

    await OTPModel.create(otpdata);

    // Resend OTP email

    const mailresponse = await sendVerificationEmail(
      OtpToken.email,
      Number(otp)
    );
    if (!mailresponse) {
      return next(new ErrorHandler("Failed to send verification email", 500));
    }
    res.status(201).json({ message: "OTP resend successfully." });
  } catch (err) {
    console.error(err);
    return next(new ErrorHandler("An unknown error occurred", 500));
  }
};
