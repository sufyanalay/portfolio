import mongoose, { Schema, model, models, Document } from "mongoose";

export interface ITestimonial extends Document {
  quote: string;
  name: string;
  title: string;
  order: number;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    quote: { type: String, required: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Testimonial || model<ITestimonial>("Testimonial", TestimonialSchema);