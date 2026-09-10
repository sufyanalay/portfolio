import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IService extends Document {
  label: string;
  order: number;
}

const ServiceSchema = new Schema<IService>(
  {
    label: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Service || model<IService>("Service", ServiceSchema);