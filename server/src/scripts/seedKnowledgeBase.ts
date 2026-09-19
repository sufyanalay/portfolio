import dotenv from "dotenv";
import mongoose from "mongoose";
import KnowledgeChunk from "../models/KnowledgeChunk";
import { embedText } from "../config/ai";

dotenv.config();

/**
 * scripts/seedKnowledge.ts
 * ----------------
 * Ye script tumhare portfolio ka data leta hai, har chunk ke liye
 * Gemini se embedding banata hai, aur MongoDB ke KnowledgeChunk
 * collection mein store kar deta hai.
 *
 * Chalane ka tareeqa (terminal mein, server folder ke andar):
 *   npx ts-node src/scripts/seedKnowledge.ts
 */

interface SeedItem {
  sourceType: "project" | "experience" | "about" | "stack" | "service";
  title: string;
  content: string;
  tags: string[];
}

const KNOWLEDGE_DATA: SeedItem[] = [
  {
    sourceType: "about",
    title: "Sufyan Ali - Professional Profile",
    content:
      "Sufyan Ali is a software engineer specializing in MERN Stack Engineering and ASP.NET Core 10 development. He builds backend systems, secure Web APIs, enterprise applications and full-stack products with a focus on maintainable architecture and reliable business workflows.",
    tags: ["about", "profile"],
  },
  {
    sourceType: "stack",
    title: "Sufyan Ali - MERN Stack Engineering",
    content:
      "Sufyan Ali is a MERN Stack Engineer who builds production-ready applications with MongoDB, Express.js, React, Node.js and TypeScript. His work includes REST APIs, authentication, authorization, database design, admin dashboards and scalable business workflows.",
    tags: ["mern", "stack"],
  },
  {
    sourceType: "stack",
    title: "Sufyan Ali - ASP.NET Core 10 Development",
    content:
      "Sufyan Ali develops backend systems with ASP.NET Core 10 and C#. He builds secure Web APIs and enterprise applications using Entity Framework Core and SQL Server, including authentication, role-based access, database-driven modules and business workflows.",
    tags: ["dotnet", "stack"],
  },
  {
    sourceType: "stack",
    title: "Sufyan Ali - RAG & AI Systems",
    content:
      "Sufyan Ali built a Retrieval-Augmented Generation (RAG) system for his own portfolio, combining Google Gemini embeddings, MongoDB Atlas Vector Search, and LLM-based response generation. This allows visitors to ask natural-language questions about his skills, projects, and experience, with answers grounded in real evidence.",
    tags: ["rag", "ai", "vector-search"],
  },
  {
    sourceType: "project",
    title: "Trendora - Social Platform",
    content:
      "Trendora is a social platform built with React, Node.js, MongoDB, Socket.IO and Cloudinary. Sufyan worked on the full-stack platform, including backend APIs and real-time communication features.",
    tags: ["trendora", "react", "socket.io"],
  },
  {
    sourceType: "project",
    title: "MediTour Global - Medical Tourism Platform",
    content:
      "MediTour Global is a medical tourism platform connecting international patients with hospitals and doctors. It uses Node.js, Express and MongoDB and includes business workflows for healthcare services and role-based access.",
    tags: ["meditour", "healthcare"],
  },
  {
    sourceType: "project",
    title: "BB360 ERP - Enterprise Resource Planning",
    content:
      "BB360 ERP is an enterprise resource planning system covering accounting, manufacturing and HR modules. Sufyan built backend workflows with Node.js, Express and MongoDB for business management operations.",
    tags: ["bb360", "erp"],
  },
  {
    sourceType: "project",
    title: "Assar Patches - E-commerce Platform",
    content:
      "Assar Patches is a MERN stack e-commerce website with an admin panel for managing products and content. Sufyan worked with MongoDB, Express, React and Node.js to support the store and its management workflows.",
    tags: ["assar", "e-commerce"],
  },
  {
    sourceType: "project",
    title: "inner-circle-portal - Client Management Portal",
    content:
      "inner-circle-portal is a private client management experience built with Next.js, TypeScript and MongoDB Atlas. The project focuses on invitation-based access and secure client workflows.",
    tags: ["inner-circle-portal", "nextjs"],
  },
  {
    sourceType: "experience",
    title: "Berry Boost Software Solutions - Backend Engineer",
    content:
      "Sufyan Ali works as a MERN Stack Backend Engineer at Berry Boost Software Solutions, Lahore (2026 - Present). He builds scalable backend systems using Node.js, Express.js, TypeScript and MongoDB, developing enterprise applications, REST APIs, authentication systems and ERP modules.",
    tags: ["berry-boost", "experience"],
  },
  {
    sourceType: "experience",
    title: "NS Solutions - ASP.NET Developer",
    content:
      "Sufyan Ali worked as an ASP.NET Developer at NS Solutions, Sialkot (2025 - 2026). He developed enterprise ERP applications using ASP.NET, C#, SQL Server and Entity Framework, working on leasing, distribution and business management systems.",
    tags: ["ns-solutions", "experience"],
  },
  {
    sourceType: "service",
    title: "Sufyan Ali - Engineering Services",
    content:
      "Sufyan provides backend API development, full-stack MERN application development, ASP.NET Core Web API development, database design with MongoDB or SQL Server, authentication and role-based access, admin dashboards, AI chatbot integration with RAG, and technical architecture support.",
    tags: ["services"],
  },
];

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log("Connected.");

  console.log("Clearing existing KnowledgeChunk data...");
  await KnowledgeChunk.deleteMany({});

  console.log(`Seeding ${KNOWLEDGE_DATA.length} chunks with embeddings...`);

  for (const item of KNOWLEDGE_DATA) {
    try {
      const embedding = await embedText(`${item.title}. ${item.content}`);

      await KnowledgeChunk.create({
        sourceType: item.sourceType,
        title: item.title,
        content: item.content,
        tags: item.tags,
        embedding,
      });

      console.log(`✓ Seeded: ${item.title}`);
    } catch (err) {
      console.error(`✗ Failed to seed "${item.title}":`, err);
    }
  }

  console.log("Done. Disconnecting...");
  await mongoose.disconnect();
  process.exit(0);
}

seed();