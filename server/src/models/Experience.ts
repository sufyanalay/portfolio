import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IExperience extends Document {
  company: string;
  role: string;
  duration: string;
  current: boolean;
  description: string;
  highlights: string[];
  order: number;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
    duration: { type: String, required: true },
    current: { type: Boolean, default: false },
    description: { type: String, required: true },
    highlights: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Experience || model<IExperience>("Experience", ExperienceSchema);