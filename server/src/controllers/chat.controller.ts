import { Request, Response } from "express";
import KnowledgeChunk from "../models/KnowledgeChunk";
import { embedText, askLLM } from "../config/ai";

/**
 * controllers/chat.controller.ts
 * ----------------
 * Ye tumhare RAG system ka "dimaag" hai. Jab visitor koi question
 * puchta hai, flow ye hota hai:
 *
 *   1. User ka message aata hai (POST /api/chat)
 *   2. Us message ka embedding banaya jaata hai
 *   3. MongoDB Atlas Vector Search se top-5 sabse "relevant" chunks nikalte hain
 *   4. Un chunks ko context bana kar LLM ko diya jaata hai
 *   5. LLM sirf usi context ke andar rehkar answer deta hai
 *   6. Response mein answer + sources (evidence) dono wapas jaate hain
 *
 * MINIMUM_SCORE threshold isliye hai taake agar koi bilkul unrelated
 * sawal poochay (jaise "banking app banaya?") to system confidently
 * "no evidence" bole, instead of forcing a weak match.
 */

const MINIMUM_SCORE = 0.72; // cosine similarity threshold, tune later based on testing

interface SearchResult {
  title: string;
  content: string;
  sourceType: string;
  sourceId?: string | undefined;
  tags?: string[];
  score: number;
}

const BUILT_IN_KNOWLEDGE: SearchResult[] = [
  {
    title: "Sufyan Ali - Professional Profile",
    content:
      "Sufyan Ali is a software engineer specializing in MERN Stack Engineering and ASP.NET Core 10 development. He builds backend systems, secure Web APIs, enterprise applications and full-stack products with a focus on maintainable architecture and reliable business workflows.",
    sourceType: "about",
    score: 0.8,
  },
  {
    title: "Sufyan Ali - MERN Stack Engineering",
    content:
      "Sufyan Ali is a MERN Stack Engineer who builds production-ready applications with MongoDB, Express.js, React, Node.js and TypeScript. His work includes REST APIs, authentication, authorization, database design, admin dashboards and scalable business workflows.",
    sourceType: "stack",
    score: 0.8,
  },
  {
    title: "Sufyan Ali - ASP.NET Core 10 Development",
    content:
      "Sufyan Ali develops backend systems with ASP.NET Core 10 and C#. He builds secure Web APIs and enterprise applications using Entity Framework Core and SQL Server, including authentication, role-based access, database-driven modules and business workflows.",
    sourceType: "stack",
    score: 0.8,
  },
  {
    title: "Trendora - Social Platform",
    content:
      "Trendora is a social platform built with React, Node.js, MongoDB, Socket.IO and Cloudinary. Sufyan worked on the full-stack platform, including backend APIs and real-time communication features.",
    sourceType: "project",
    score: 0.8,
  },
  {
    title: "MediTour Global - Medical Tourism Platform",
    content:
      "MediTour Global is a medical tourism platform connecting international patients with hospitals and doctors. It uses Node.js, Express and MongoDB and includes business workflows for healthcare services and role-based access.",
    sourceType: "project",
    score: 0.8,
  },
  {
    title: "BB360 ERP - Enterprise Resource Planning",
    content:
      "BB360 ERP is an enterprise resource planning system covering accounting, manufacturing and HR modules. Sufyan built backend workflows with Node.js, Express and MongoDB for business management operations.",
    sourceType: "project",
    score: 0.8,
  },
  {
    title: "Assar Patches - E-commerce Platform",
    content:
      "Assar Patches is a MERN stack e-commerce website with an admin panel for managing products and content. Sufyan worked with MongoDB, Express, React and Node.js to support the store and its management workflows.",
    sourceType: "project",
    score: 0.8,
  },
  {
    title: "inner-circle-portal - Client Management Portal",
    content:
      "inner-circle-portal is a private client management experience built with Next.js, TypeScript and MongoDB Atlas. The project focuses on invitation-based access and secure client workflows.",
    sourceType: "project",
    score: 0.8,
  },
  {
    title: "Sufyan Ali - Engineering Services",
    content:
      "Sufyan provides backend API development, full-stack MERN application development, ASP.NET Core Web API development, database design with MongoDB or SQL Server, authentication and role-based access, admin dashboards, and technical architecture support.",
    sourceType: "service",
    score: 0.8,
  },
];

function selectBuiltInKnowledge(message: string): SearchResult[] {
  const query = message.toLowerCase();
  const selected = BUILT_IN_KNOWLEDGE.filter((chunk) => {
    const searchableText = `${chunk.title} ${chunk.content}`.toLowerCase();
    return searchableText.split(/[^a-z0-9.#+-]+/).some((term) =>
      term.length > 2 && query.includes(term)
    );
  });

  if (/who is|about sufyan|profile|person/i.test(message)) {
    return BUILT_IN_KNOWLEDGE.filter((chunk) => chunk.sourceType === "about");
  }

  if (/service|services|offer|provide|can you build|help with/i.test(message)) {
    return BUILT_IN_KNOWLEDGE.filter((chunk) => chunk.sourceType === "service");
  }

  const matchingProjects = selected.filter((chunk) => chunk.sourceType === "project");
  if (matchingProjects.length > 0) {
    return matchingProjects;
  }

  if (/project|projects|built|build|work|portfolio/i.test(message)) {
    return BUILT_IN_KNOWLEDGE.filter((chunk) => chunk.sourceType === "project");
  }

  const stack = selected.filter((chunk) => chunk.sourceType === "stack");
  return stack.length > 0
    ? stack
    : BUILT_IN_KNOWLEDGE.filter((chunk) => chunk.sourceType === "about");
}

export const chatHandler = async (req: Request, res: Response) => {
  try {
    const { message, mode = "ask" } = req.body as {
      message: string;
      mode?: "ask" | "job_match" | "challenge" | "architect";
    };

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: "message is required" });
    }

    const isPortfolioQuestion = /sufyan|portfolio|project|trendora|meditour|bb360|assar|inner.?circle|mern|asp\.?\s*\.?(net|dotnet)|\.net|c#|react|node|mongodb|express|typescript|sql|api|backend|frontend|full.?stack|technology|technologies|stack|skill|experience|work|built|build|resume|cv|hire|contact|email|phone|lahore|pakistan/i.test(message);

    if (!isPortfolioQuestion) {
      return res.json({
        answer: "I can answer questions about Sufyan Ali's skills, projects, experience, and portfolio.",
        sources: [],
        confidence: "none",
      });
    }

    // Step 1: embed the user's question when Gemini embeddings are available.
    let queryEmbedding: number[] = [];
    try {
      queryEmbedding = await embedText(message);
    } catch (embeddingError) {
      console.error("Embedding unavailable, using built-in knowledge:", embeddingError);
    }

    // Step 2: vector search in MongoDB Atlas
    let results: SearchResult[];

    try {
      if (queryEmbedding.length === 0) {
        results = [];
      } else {
      results = await KnowledgeChunk.aggregate<SearchResult>([
        {
          $vectorSearch: {
            index: "vector_index", // must match the Atlas index name you create
            path: "embedding",
            queryVector: queryEmbedding,
            numCandidates: 100,
            limit: 5,
          },
        },
        {
          $project: {
            title: 1,
            content: 1,
            sourceType: 1,
            sourceId: 1,
            tags: 1,
            score: { $meta: "vectorSearchScore" },
          },
        },
      ]);
      }
    } catch (searchError) {
      console.error("Vector search unavailable, using knowledge fallback:", searchError);

      const fallbackChunks = await KnowledgeChunk.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      results = fallbackChunks.map((chunk) => ({
        title: chunk.title,
        content: chunk.content,
        sourceType: chunk.sourceType,
        ...(chunk.sourceId ? { sourceId: chunk.sourceId } : {}),
        tags: chunk.tags,
        score: 0.8,
      }));

      if (results.length === 0) {
        results = selectBuiltInKnowledge(message);
      }
    }

    if (results.length === 0) {
      results = selectBuiltInKnowledge(message);
    }

    let relevant = results.filter((r) => r.score >= MINIMUM_SCORE);

    const asksAboutPortfolio = /mern|asp\.?\s*\.?(net|dotnet)|\.net|c#|technology|technologies|stack|backend|project|projects|built|build|work|portfolio|service|services|offer|provide/i.test(message);
    if (relevant.length === 0 && asksAboutPortfolio) {
      relevant = selectBuiltInKnowledge(message);
    }

    // Step 3: if nothing relevant enough was found, don't even call the LLM —
    // save cost and guarantee an honest "I don't know" answer.
    if (relevant.length === 0) {
      return res.json({
        answer:
          "I couldn't find sufficient evidence for that in Sufyan's portfolio.",
        sources: [],
        confidence: "none",
      });
    }

    const topScore = relevant[0]?.score ?? 0;

    const context = relevant
      .map((r) => `[${r.title}]\n${r.content}`)
      .join("\n\n---\n\n");

    // Step 4: ask the LLM, constrained to only the retrieved context
    let answer: string;
    try {
      answer = await askLLM({ userMessage: message, context, mode });
    } catch (llmError) {
      console.error("Gemini response unavailable, using context answer:", llmError);
      answer = `Based on Sufyan's portfolio: ${relevant
        .slice(0, 3)
        .map((result) => `${result.title}: ${result.content}`)
        .join(" ")}`;
    }

    // Step 5: return answer + evidence sources for the "View Evidence" UI
    res.json({
      answer,
      sources: relevant.map((r) => ({
        title: r.title,
        sourceType: r.sourceType,
        sourceId: r.sourceId,
        score: Math.round(r.score * 100),
      })),
      confidence:
        topScore > 0.85
          ? "high"
          : topScore > 0.75
          ? "medium"
          : "low",
    });
  } catch (err) {
    console.error("chatHandler error:", err);
    res.status(500).json({ error: "Something went wrong processing your question." });
  }
};