import mongoose, { Schema, Document } from "mongoose";

interface ActionDetails {
  [key: string]: string | number | boolean | object | null; // Strict type for details object
}

export interface IAuditLog extends Document {
  auditId: string;
  user: mongoose.Types.ObjectId;
  actionType: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "OTHER";
  details?: ActionDetails; // Type-safe additional metadata
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    auditId: {
      type: String,
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    actionType: {
      type: String,
      enum: ["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "OTHER"],
      required: true,
    },
    details: { type: Object, default: {} }, // Type-safe object instead of "any"
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
