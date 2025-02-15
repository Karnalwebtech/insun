import mongoose, { Schema, Document } from "mongoose";

export interface IClaim extends Document {
  claimId: string;
  policyId: mongoose.Types.ObjectId;
  amountRequested: number;
  amountApproved?: number;
  status: "pending" | "approved" | "rejected" | "under review";
  filedAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  reasonForRejection?: string;
  supportingDocuments?: string[];
  comments?: string;
  assignedAgent?: mongoose.Types.ObjectId;
  lastUpdatedBy?: mongoose.Types.ObjectId;
}

const ClaimSchema = new Schema<IClaim>(
  {
    claimId: { type: String, required: true },
    policyId: { type: Schema.Types.ObjectId, ref: "Policy", required: true },
    amountRequested: { type: Number, required: true },
    amountApproved: { type: Number, default: null },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "under review"],
      default: "pending",
    },
    filedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date, default: null },
    rejectedAt: { type: Date, default: null },
    reasonForRejection: { type: String, default: null },
    supportingDocuments: [{ type: String }], // Array of document URLs or file paths
    comments: { type: String, default: null },
    assignedAgent: { type: Schema.Types.ObjectId, ref: "Agent", default: null },
    lastUpdatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export default mongoose.model<IClaim>("Claim", ClaimSchema);
