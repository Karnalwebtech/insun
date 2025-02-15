import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  userId: string;
  name: string;
  email: string;
  password: string;
  image: string;
  provider: string;
  isVerified?: boolean;
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: Date;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
  role: "user" | "admin" | "agent";
  dashboard: "user" | "admin" | "agent";
  dateOfBirth?: Date;
  phoneNumber?: string;
  address?: string;
  socialMediaProfiles?: { platform: string; url: string }[];
  lastLogin?: Date;
  is2FAEnabled?: boolean;
  resetPasswordToken?: string;
  resetPasswordTokenExpiry?: Date;
  permissions?: string[];
  subscriptionPlan?: string;
  isProfileComplete?: boolean;
  activityLog?: mongoose.Types.ObjectId[];
  preferences?: { language?: string; notifications?: boolean };
  isAccountLocked?: boolean;
  deactivatedAt?: Date;
  referralCode?: string;
  securityQuestions?: { question: string; answer: string }[];
}

const UserSchema = new Schema<IUser>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    provider: { type: String, default: null },
    image: { type: String, default: null},
    isVerified: { type: Boolean, default: false },
    verifyToken: String,
    verifyTokenExpiry: Date,
    role: { type: String, enum: ["user", "admin", "agent"], default: "user" },
    dashboard: {
      type: String,
      enum: ["user", "admin", "agent"],
      default: "user",
    },
    dateOfBirth: Date,
    phoneNumber: { type: String, unique: true },
    address: { type: Schema.Types.ObjectId },
    socialMediaProfiles: [
      {
        platform: {
          type: String,
          enum: ["facebook", "twitter", "linkedin", "instagram"],
        },
        url: { type: String },
      },
    ],
    lastLogin: { type: Date },
    is2FAEnabled: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date,
    permissions: [
      { type: String, enum: ["read", "write", "delete", "update"] },
    ],
    subscriptionPlan: {
      type: String,
      enum: ["basic", "premium", "enterprise"],
    },
    isProfileComplete: { type: Boolean, default: false },
    activityLog: [{ type: Schema.Types.ObjectId, ref: "UserActivity" }],
    preferences: {
      language: { type: String, default: "en" },
      notifications: { type: Boolean, default: true },
    },
    isAccountLocked: { type: Boolean, default: false },
    deactivatedAt: Date,
    referralCode: String,
    securityQuestions: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Check if the model already exists before defining it
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
