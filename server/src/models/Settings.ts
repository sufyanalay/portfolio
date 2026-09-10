import mongoose, { Schema, model, models, Document } from "mongoose";

export interface ISettings extends Document {
  aboutHeading: string;
  heroTagline: string;
  heroSubtext: string;
  aboutBio: string[];
  aboutBadges: string[];
  email: string;
  phone: string;
  linkedinUrl: string;
  githubUrl: string;
  resumeUrl: string;
  profileImage: string;
}

const SettingsSchema = new Schema<ISettings>(
  {
    aboutHeading: { type: String, default: "Professional Profile" },
    heroTagline: { type: String, default: "" },
    heroSubtext: { type: String, default: "" },
    aboutBio: { type: [String], default: [] },
    aboutBadges: { type: [String], default: [] },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    linkedinUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    profileImage: { type: String, default: "" },
  },
  { timestamps: true }
);

export default models.Settings || model<ISettings>("Settings", SettingsSchema);