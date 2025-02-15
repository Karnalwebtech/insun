import mongoose, { Schema, Document } from "mongoose";

export interface IBeneficiary extends Document {
  beneficiaryId: string;
  policyId: mongoose.Types.ObjectId;
  name: string;
  relationship: string;
  percentage: number;
  contactNumber?: string;
  email?: string;
  address?: string;
  dateOfBirth?: Date;
  identificationNumber?: string;
  status: "ACTIVE" | "INACTIVE" | "REMOVED";
}

const BeneficiarySchema = new Schema<IBeneficiary>(
  {
    beneficiaryId: { type: String, required: true },
    policyId: { type: Schema.Types.ObjectId, ref: "Policy", required: true },
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    percentage: { type: Number, required: true, min: 0, max: 100 },
    contactNumber: { type: String, default: null },
    email: { type: String, default: null },
    address: { type: String, default: null },
    dateOfBirth: { type: Date, default: null },
    identificationNumber: { type: String, default: null },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "REMOVED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBeneficiary>("Beneficiary", BeneficiarySchema);
