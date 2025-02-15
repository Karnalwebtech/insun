import mongoose, { Schema, Document } from "mongoose";

export interface IPolicyHolder extends Document {
  userId: mongoose.Types.ObjectId;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

const PolicyHolderSchema = new Schema<IPolicyHolder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPolicyHolder>(
  "PolicyHolder",
  PolicyHolderSchema
);
