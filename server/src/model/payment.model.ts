import mongoose, { Schema, Document } from "mongoose";

export interface IPolicy extends Document {
  policyNumber: string;
  policyHolder: mongoose.Types.ObjectId;
  coverageAmount: number;
  premiumAmount: number;
  premiumPaymentFrequency: "monthly" | "quarterly" | "annually";
  policyType: "life" | "health" | "vehicle" | "home";
  term: number; // in years
  startDate: Date;
  endDate: Date;
  status: "active" | "expired" | "cancelled";
  beneficiaries: mongoose.Types.ObjectId[]; // List of beneficiaries
  termsAndConditions?: string;
  isRenewable: boolean;
  nextRenewalDate?: Date;
  underwritingDetails?: string;
  premiumHistory: [{
    amountPaid: number;
    paymentDate: Date;
    paymentMethod: "credit_card" | "debit_card" | "bank_transfer" | "cash";
    paymentStatus: "successful" | "failed" | "pending";
  }];
  claimsHistory: mongoose.Types.ObjectId[];
  discounts: [{
    discountCode: string;
    discountAmount: number;
    reason: string;
    appliedAt: Date;
  }];
  alternateContact?: {
    name: string;
    relationship: string;
    contactNumber: string;
  };
}

const PolicySchema = new Schema<IPolicy>(
  {
    policyNumber: { type: String, required: true, unique: true },
    policyHolder: { type: Schema.Types.ObjectId, ref: "PolicyHolder", required: true },
    coverageAmount: { type: Number, required: true },
    premiumAmount: { type: Number, required: true },
    premiumPaymentFrequency: { type: String, enum: ["monthly", "quarterly", "annually"], required: true },
    policyType: { type: String, enum: ["life", "health", "vehicle", "home"], required: true },
    term: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ["active", "expired", "cancelled"], default: "active" },
    beneficiaries: [{ type: Schema.Types.ObjectId, ref: "Beneficiary", required: true }],
    termsAndConditions: { type: String },
    isRenewable: { type: Boolean, default: true },
    nextRenewalDate: { type: Date },
    underwritingDetails: { type: String },
    premiumHistory: [{
      amountPaid: { type: Number, required: true },
      paymentDate: { type: Date, required: true },
      paymentMethod: { type: String, enum: ["credit_card", "debit_card", "bank_transfer", "cash"], required: true },
      paymentStatus: { type: String, enum: ["successful", "failed", "pending"], required: true },
    }],
    claimsHistory: [{ type: Schema.Types.ObjectId, ref: "Claim" }],
    discounts: [{
      discountCode: { type: String, required: true },
      discountAmount: { type: Number, required: true },
      reason: { type: String, required: true },
      appliedAt: { type: Date, default: Date.now }
    }],
    alternateContact: {
      name: { type: String },
      relationship: { type: String },
      contactNumber: { type: String },
    }
  },
  { timestamps: true }
);

export default mongoose.model<IPolicy>("Policy", PolicySchema);
