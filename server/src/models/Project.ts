import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IProject extends Document {
  slug: string;
  name: string;
  tagline: string;
  status: "Live" | "In progress";
  role: string;
  tech: string[];
  description: string[];
  features: string[];
  images: string[];
  liveUrl?: string;
  githubUrl?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    tagline: { type: String, required: true },
    status: {
      type: String,
      enum: ["Live", "In progress"],
      default: "Live",
    },
    role: { type: String, required: true },
    tech: { type: [String], default: [] },
    description: { type: [String], default: [] },
    features: { type: [String], default: [] },
    images: { type: [String], default: [] },
    liveUrl: { type: String },
    githubUrl: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Project || model<IProject>("Project", ProjectSchema);