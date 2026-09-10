import { Schema, model, Document } from "mongoose";

/**
 * KnowledgeChunk
 * ----------------
 * Ye woh "table" hai jahan tumhara RAG system ki asli knowledge rehti hai.
 * Har document ek chhota sa paragraph hai (100-400 words) jo tumhare
 * kisi project/experience ke ek specific pehlu ko describe karta hai.
 *
 * Example rows:
 *  - sourceType: "project", title: "Trendora - Real-time Chat"
 *  - sourceType: "project", title: "BB360 ERP - Accounting Module"
 *  - sourceType: "experience", title: "Berry Boost - Backend Engineer"
 *
 * `embedding` field ek 1536-length number array hai jo OpenAI ka
 * text-embedding-3-small model generate karega. Ye "meaning" ka
 * numeric representation hai — isi se Vector Search kaam karta hai.
 */

export interface IKnowledgeChunk extends Document {
  sourceType: "project" | "experience" | "about" | "stack" | "service";
  sourceId?: string; // optional reference to an actual Project/Experience _id
  title: string;
  content: string;
  tags: string[];
  embedding: number[];
  createdAt: Date;
  updatedAt: Date;
}

const KnowledgeChunkSchema = new Schema<IKnowledgeChunk>(
  {
    sourceType: {
      type: String,
      enum: ["project", "experience", "about", "stack", "service"],
      required: true,
    },
    sourceId: { type: String }, // e.g. the Project document's _id, for linking "View Evidence"
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    embedding: {
      type: [Number],
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IKnowledgeChunk>("KnowledgeChunk", KnowledgeChunkSchema);