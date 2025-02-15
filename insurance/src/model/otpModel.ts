import mongoose, { Document, Model, Types } from "mongoose";

export interface OTP {
  userId?: Types.ObjectId;
  email?: string;
  token: string;
  expiresAt: Date;
  purpose?: "account_verification" | "password_reset";
  otpCode: number;
  attempts?: number;
  isVerified?: boolean;
}
export interface IOTPDocument extends OTP, Document {}

const otpSchema = new mongoose.Schema<IOTPDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Link to User model
    },
    email: {
      type: String,
      default: null,
    },
    otpCode: {
      type: Number,
      required: true,
      select: true,
    },
    token: {
      type: String,
      default: null,
    },
    purpose: {
      type: String,
      enum: ["account_verification", "password_reset"],
    },
    isVerified: {
      type: Boolean,
      default: false, // OTP status
    },
    attempts: {
      type: Number,
      default: 0, // Track failed attempts
    },
    expiresAt: { type: Date, required: true, default: () => new Date(Date.now() + 10 * 60 * 1000) }
  },
  { timestamps: true }
);
export const OTPModel: Model<IOTPDocument> =
  mongoose.models.Otp || mongoose.model<IOTPDocument>("Otp", otpSchema);