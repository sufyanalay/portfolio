import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IStackCategory extends Document {
  label: string;
  items: string[];
  order: number;
}

const StackSchema = new Schema<IStackCategory>(
  {
    label: { type: String, required: true },
    items: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Stack || model<IStackCategory>("Stack", StackSchema);