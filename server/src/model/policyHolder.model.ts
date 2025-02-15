import mongoose, { Schema, Document } from "mongoose";

export interface IPolicyHolder extends Document {
  userId: mongoose.Types.ObjectId;
  firstName: string;
  middleName?: string;
  lastName: string;
  address: mongoose.Types.ObjectId;
  phone: string;
  alternatePhone?: string;
  email: string;
  dateOfBirth: Date;
  gender: "male" | "female" | "other";
  nationality?: string;
  bloodType?: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
  healthConditions?: string[];
  disabilityStatus?: boolean;
  languagesSpoken?: string[];
  hobbies?: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  preferredCommunication: "email" | "phone" | "text";
  occupation?: string;
  policyHistory: mongoose.Types.ObjectId[];
  maritalStatus: "single" | "married" | "divorced" | "widowed";
  insuranceTypes: ("health" | "life" | "home" | "auto")[];
  memberId: string;
  consentToTerms: boolean;
  paymentMethod?: "credit_card" | "debit_card" | "bank_transfer" | "cash";
  socialMediaProfiles: {
    platform: "facebook" | "twitter" | "linkedin" | "instagram";
    url: string;
  }[];
  claimsHistory: mongoose.Types.ObjectId[];
  notes?: string;
}

const PolicyHolderSchema = new Schema<IPolicyHolder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    address: { type: Schema.Types.ObjectId, ref: "Address", required: true },

    phone: { type: String, required: true },
    alternatePhone: { type: String },
    email: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    nationality: { type: String },
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },
    healthConditions: [{ type: String, required: true }],
    disabilityStatus: { type: Boolean },
    languagesSpoken: [{ type: String }],
    hobbies: [{ type: String }],
    emergencyContact: {
      name: { type: String, required: true },
      relationship: { type: String, required: true },
      phone: { type: String, required: true },
    },
    preferredCommunication: {
      type: String,
      enum: ["email", "phone", "text"],
      required: true,
    },
    occupation: { type: String },
    policyHistory: [{ type: Schema.Types.ObjectId, ref: "Policy" }],
    maritalStatus: {
      type: String,
      enum: ["single", "married", "divorced", "widowed"],
      required: true,
    },
    insuranceTypes: [
      {
        type: String,
        enum: ["health", "life", "home", "auto"],
        required: true,
      },
    ],
    memberId: { type: String, required: true, unique: true },
    consentToTerms: { type: Boolean, default: false },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "bank_transfer", "cash"],
    },
    socialMediaProfiles: [
      {
        platform: {
          type: String,
          enum: ["facebook", "twitter", "linkedin", "instagram"],
          required: true,
        },
        url: { type: String, required: true },
      },
    ],
    claimsHistory: [{ type: Schema.Types.ObjectId, ref: "Claim" }],
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IPolicyHolder>(
  "PolicyHolder",
  PolicyHolderSchema
);
