import mongoose, { Schema, Document } from "mongoose";

export interface ICompany extends Document {
  companyId: string;
  name: string;
  registrationNumber: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  address?: string;
  country?: string;
  industry?: string;
  establishedDate?: Date;
  logoUrl?: string;
  status: "active" | "inactive" | "suspended";
  isVerified: boolean;
}

const CompanySchema = new Schema<ICompany>(
  {
    companyId: { type: String, required: true },
    name: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    website: { type: String, default: null },
    address: { type: String, default: null },
    country: { type: String, default: null },
    industry: { type: String, default: null },
    establishedDate: { type: Date, default: null },
    logoUrl: { type: String, default: null },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ICompany>("Company", CompanySchema);
