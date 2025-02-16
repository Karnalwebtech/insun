import { NextFunction, Request, Response } from "express";
import { OTPModel } from "../../model/otpModel";
import { User } from "../../model/user.model";
import ErrorHandler from "../../utils/errorHandler";

const MAX_ATTEMPTS = 5;

export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { otpValue, token } = req.body;

    if (!otpValue || !token) {
      return next(new ErrorHandler("OTP and token are required", 400));
    }

    // Find the most recent OTP record for the given token
    const otpRecord = await OTPModel.findOne({ token })
      .sort({ createdAt: -1 })
      .exec();

    if (!otpRecord) {
      return next(new ErrorHandler("Invalid token", 404));
    }

    if (otpRecord.expiresAt < new Date()) {
      return next(new ErrorHandler("OTP has expired", 410));
    }

    if (otpRecord.isVerified) {
      return next(new ErrorHandler("OTP has already been verified", 400));
    }

    if (!otpRecord.attempts) {
      otpRecord.attempts = 0;
    }

    if (otpRecord.attempts >= MAX_ATTEMPTS) {
      return next(
        new ErrorHandler(
          "Too many failed attempts. Please request a new OTP.",
          429
        )
      );
    }

    if (otpRecord.otpCode !== Number(otpValue)) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      res.status(400).json({
        message: "Invalid OTP",
        attemptsLeft: MAX_ATTEMPTS - otpRecord.attempts,
      });
      return;
    }

    // OTP is valid, update records
    otpRecord.isVerified = true;
    otpRecord.attempts = 0;
    await otpRecord.save();

    const user = await User.findOneAndUpdate(
      { verifyToken: token },
      { $set: { isVerified: true } },
      { new: true }
    );

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Invalidate all previous OTPs for this token
    await OTPModel.updateMany(
      { token, _id: { $ne: otpRecord._id } },
      { $set: { isVerified: true, attempts: MAX_ATTEMPTS } }
    );
    res.status(200).json({
      message: "OTP verified successfully",
      accessToken: token,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return next(
      new ErrorHandler("An error occurred during OTP verification", 500)
    );
  }
};
