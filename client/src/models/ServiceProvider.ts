import mongoose, { Schema, Document } from "mongoose";

// Define TypeScript interface for type safety
export interface IServiceProvider extends Document {
  name: string;
  service: string;
  rate: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
}

const ServiceProviderSchema = new Schema<IServiceProvider>({
  name: { type: String, required: true },
  service: { type: String, required: true },
  rate: { type: String, required: true },
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true },
  },
});

ServiceProviderSchema.index({ location: "2dsphere" });

// Ensure the model is only compiled once to prevent issues in Next.js API routes
export default mongoose.models.ServiceProvider ||
  mongoose.model<IServiceProvider>("ServiceProvider", ServiceProviderSchema);
