import mongoose, { Document, Model, Types, Schema } from "mongoose";

export interface ICustomer extends Document {
    no: number;
    id: string;
    fullname: string;
    policy_no: string;
    phone: number;
    dop: Date;
    dor: Date;
    issue_policy_year: Date;
    si: string;
    amount: number;
    email: string;
    category: string;
    health_conditions: string;
    addhar_card: Types.ObjectId;
    pan_card: Types.ObjectId;
    document: Types.ObjectId;
    profile_image: Types.ObjectId;
    user: Types.ObjectId;
    is_active?: boolean; // Optional field
}

// Define the schema
const customerSchema: Schema<ICustomer> = new mongoose.Schema(
    {
        no: { type: Number, default: 0 },
        id: { type: String, default: null },
        fullname: { type: String, default: null },
        policy_no: { type: String, default: null },
        phone: { type: Number, default: null },
        dop: { type: Date, default: null },
        dor: { type: Date, default: null },
        issue_policy_year: { type: Date, default: null },
        si: { type: String, default: null },
        amount: { type: Number, default: 0 },
        email: { type: String, default: null }, // Fixed 'string' to 'String'
        category: { type: String, default: null }, // Fixed
        health_conditions: { type: String, default: null }, // Fixed
        addhar_card: { type: Schema.Types.ObjectId, ref: "File" }, // Change ref if needed
        pan_card: { type: Schema.Types.ObjectId, ref: "File" }, // Change ref if needed
        document: { type: Schema.Types.ObjectId, ref: "File" }, // Change ref if needed
        profile_image: { type: Schema.Types.ObjectId, ref: "File" }, // Change ref if needed
        user: { type: Schema.Types.ObjectId, ref: "User" },
        is_active: { type: Boolean, default: true }, // Changed from `isActive` to `is_active` for consistency
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

// Create the model
const CustomerModel: Model<ICustomer> = mongoose.model<ICustomer>(
    "Customer",
    customerSchema
);

export default CustomerModel;
