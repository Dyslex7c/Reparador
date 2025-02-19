import mongoose, { Schema, Document } from "mongoose";

// Define TypeScript interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

// Ensure the model is only compiled once
export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
