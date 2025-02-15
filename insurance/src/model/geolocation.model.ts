import mongoose, { Schema, Document } from "mongoose";

// Interface for the GeoLocation document
export interface IGeoLocation extends Document {
  coordinates: { type: [number, number] }; // [longitude, latitude]
  country?: string;
  state?: string;
  city?: string;
  region?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

// GeoLocation Schema
const GeoLocationSchema = new Schema<IGeoLocation>(
  {
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      index: "2dsphere", // Create a 2dsphere index for geospatial queries
    },
    country: { type: String, required: false },
    state: { type: String, required: false },
    city: { type: String, required: false },
    region: { type: String, required: false },
    address: { type: String, required: false },
  },
  { timestamps: true }
);

// Export the model for GeoLocation
export default mongoose.model<IGeoLocation>("GeoLocation", GeoLocationSchema);
