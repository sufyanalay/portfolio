import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IMilestone {
  year: string;
  title: string;
  description: string;
  current: boolean;
}

export interface IStat {
  value: string;
  label: string;
}

export interface IJourney extends Document {
  heading: string;
  milestones: IMilestone[];
  stats: IStat[];
}

const MilestoneSchema = new Schema<IMilestone>(
  {
    year: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    current: { type: Boolean, default: false },
  },
  { _id: false }
);

const StatSchema = new Schema<IStat>(
  {
    value: { type: String, required: true },
    label: { type: String, required: true },
  },
  { _id: false }
);

const JourneySchema = new Schema<IJourney>(
  {
    heading: { type: String, default: "From first commit to production systems" },
    milestones: { type: [MilestoneSchema], default: [] },
    stats: { type: [StatSchema], default: [] },
  },
  { timestamps: true }
);

export default models.Journey || model<IJourney>("Journey", JourneySchema);