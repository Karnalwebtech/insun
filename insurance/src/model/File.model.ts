import mongoose, { Document, Model, Types, Schema } from "mongoose";
// Define the IFile interface to match the image data structure
export interface IFile extends Document {
  no: number;
  originalname: string;
  encoding: string;
  mimetype: string;
  fieldname: string;
  filename: string;
  path: string;
  size: number;
  altText: string;
  title: string;
  caption: string;
  user: Types.ObjectId;
  is_active?: boolean; // Optional field
}

// Define the image schema
const fileSchema: Schema<IFile> = new mongoose.Schema(
  {
    no: {
      type: Number,
      default: 0,
    },
    originalname: {
      type: String,
      default: null,
    },
    encoding: {
      type: String,
      default: null,
    },
    filename: {
      type: String,
      default: null,
    },
    fieldname: {
      type: String,
      default: null,
    },
    path: {
      type: String,
      default: null,
    },
    size: {
      type: Number,
      default: null,
    },
    altText: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    caption: {
      type: String,
      default: null,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the Image model
const fileModel: Model<IFile> = mongoose.model<IFile>("File", fileSchema);

export default fileModel;
