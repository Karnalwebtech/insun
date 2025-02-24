import mongoose, { Document, Model, Types, Schema } from "mongoose";

export interface ICustomer extends Document {
    no: number;
    id: string;
    fullname: string;
    policy_no: string;
    phone: number;
    dop: string;
    dor: string;
    issue_policy_year: string;
    si: number;
    amount: number;
    email: string;
    category: string;
    premium_mode: string;
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
        dop: { type: String, default: null },
        dor: { type: String, default: null },
        issue_policy_year: { type: String, default: null },
        si: { type: Number, default: null },
        amount: { type: Number, default: 0 },
        email: { type: String, default: null }, // Fixed 'string' to 'String'
        category: { type: String, default: null }, // Fixed
        premium_mode: { type: String, default: null }, // Fixed
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
