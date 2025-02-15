import mongoose, { Schema, Document } from "mongoose";

export interface IAgent extends Document {
  agentId: string;
  agencyName: string;
  licenseNumber: string;
  contactNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  experienceYears: number;
  certification: string[];
  activeStatus: boolean;
  licenseExpiryDate: Date;
}

const AgentSchema = new Schema<IAgent>(
  {
    agentId: { type: String, required: true },
    agencyName: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
    experienceYears: { type: Number, required: true },
    certification: { type: [String], default: [] },
    activeStatus: { type: Boolean, default: true },
    licenseExpiryDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IAgent>("Agent", AgentSchema);
