import mongoose from "mongoose";
import dotenv from "dotenv";
import KnowledgeChunk from "../models/KnowledgeChunk";
import { embedText } from "../config/ai";

dotenv.config();

/**
 * scripts/seedKnowledgeBase.ts
 * ----------------
 * Ye script sirf ek baar (ya jab bhi naya knowledge add karna ho) chalani hai.
 * Kaam: har chunk ka text OpenAI se embed karwana, phir MongoDB mein save karna.
 *
 * Run karne ka tareeka:
 *   npx ts-node src/scripts/seedKnowledgeBase.ts
 *
 * IMPORTANT: Ye sirf STARTING TEMPLATE hai. Tumhe apne asal projects
 * (Trendora, BB360 ERP, MediTour, Assar Patches, inner-circle-portal)
 * ke real technical details se in chunks ko replace/expand karna hai.
 * Jitna detailed aur accurate ye text hoga, utna better AI ke answers honge.
 */

const rawChunks = [
  {
    sourceType: "stack" as const,
    title: "Sufyan Ali - MERN Stack Engineering",
    tags: ["mern", "mongodb", "express", "react", "node.js", "typescript", "rest-api"],
    content:
      "Sufyan Ali is a MERN Stack Engineer who builds production-ready applications with MongoDB, Express.js, React, Node.js and TypeScript. His backend work includes REST APIs, authentication, authorization, database design, admin dashboards and scalable business workflows. He focuses on clean architecture, reliable API behavior and maintainable full-stack product development.",
  },
  {
    sourceType: "stack" as const,
    title: "Sufyan Ali - ASP.NET Core 10 Development",
    tags: ["asp.net core 10", "asp.net", "dotnet", "c#", "web-api", "entity-framework", "sql-server"],
    content:
      "Sufyan Ali develops backend systems with ASP.NET Core 10 and C#. He builds secure Web APIs and enterprise applications using Entity Framework Core and SQL Server, including authentication, role-based access, database-driven modules and business workflows. His .NET experience covers maintainable API architecture, validation, performance and reliable integration with frontend applications.",
  },
  {
    sourceType: "experience" as const,
    title: "Berry Boost Software Solutions - Backend Engineer",
    tags: ["node.js", "express", "mongodb", "rest-api", "jwt", "erp"],
    content:
      "Sufyan currently works as a MERN Stack Backend Engineer at Berry Boost Software Solutions (2026 - Present). He builds scalable backend systems using Node.js, Express.js, TypeScript and MongoDB. His work includes REST APIs, JWT authentication systems, and ERP modules, with a strong focus on performance and clean architecture.",
  },
  {
    sourceType: "experience" as const,
    title: "NS Solutions - ASP.NET Developer",
    tags: ["asp.net", "c#", "sql-server", "entity-framework", "erp"],
    content:
      "Sufyan worked as an ASP.NET Developer at NS Solutions, Sialkot (2025-2026). He developed enterprise ERP applications using ASP.NET, C#, SQL Server and Entity Framework, working on leasing and distribution business management systems, including secure backend modules and database-driven applications.",
  },
  {
    sourceType: "project" as const,
    title: "Trendora - Overview",
    tags: ["react", "node.js", "mongodb", "socket.io", "cloudinary"],
    content:
      "Trendora is a social platform built with React, Node.js, MongoDB, Socket.IO and Cloudinary. TODO: replace this with a real description of what Trendora does — its core features, who uses it, and what problem it solves.",
  },
  {
    sourceType: "project" as const,
    title: "Trendora - Real-time Communication",
    tags: ["socket.io", "real-time", "chat"],
    content:
      "Trendora uses Socket.IO for real-time features. TODO: describe exactly what is real-time here — chat, notifications, live feed updates? Explain how the socket connection is established between the React client and Node/Express backend, and how events are structured.",
  },
  {
    sourceType: "project" as const,
    title: "MediTour Global - Overview",
    tags: [".net", "react", "role-based-access", "healthcare"],
    content:
      "MediTour Global is a medical tourism platform connecting international patients with verified hospitals and doctors, built with Node.js, Express and MongoDB. TODO: add details on role-based portals (patient/hospital/admin roles), and how appointment or verification workflows work.",
  },
  {
    sourceType: "project" as const,
    title: "BB360 ERP - Overview",
    tags: ["erp", "mongodb", "node.js", "accounting", "manufacturing", "hr"],
    content:
      "BB360 ERP is an enterprise resource planning system covering accounting, manufacturing and HR modules, built with Node.js, Express and MongoDB. TODO: describe the 4-level Chart of Accounts, double-entry accounting logic, and how manufacturing/HR modules are structured.",
  },
  {
    sourceType: "project" as const,
    title: "Assar Patches - Overview",
    tags: ["mern", "ecommerce", "admin-panel"],
    content:
      "Assar Patches is a MERN stack e-commerce website with an admin panel for managing products and content. TODO: describe product management, blog/content management, and payment/inventory handling if present.",
  },
  {
    sourceType: "project" as const,
    title: "inner-circle-portal - Overview",
    tags: ["next.js", "typescript", "mongo-atlas", "private"],
    content:
      "inner-circle-portal is a private, invitation-only client management experience built with Next.js, TypeScript and MongoDB Atlas. TODO: describe the invitation flow, what data clients manage, and any unique access-control logic.",
  },
];

async function main() {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log("Connected to MongoDB. Seeding knowledge base...");

  for (const chunk of rawChunks) {
    const embedding = await embedText(`${chunk.title}\n${chunk.content}`);
    await KnowledgeChunk.create({ ...chunk, embedding });
    console.log(`Seeded: ${chunk.title}`);
  }

  console.log("Done. Total chunks:", rawChunks.length);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});