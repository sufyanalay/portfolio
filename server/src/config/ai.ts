import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_BASE =
  "https://generativelanguage.googleapis.com/v1beta";

function getGeminiKey() {
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  return key;
}

export async function embedText(text: string): Promise<number[]> {
  const response = await fetch(
    `${GEMINI_API_BASE}/models/gemini-embedding-001:embedContent?key=${getGeminiKey()}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "models/gemini-embedding-001",
        content: {
          parts: [{ text }],
        },
        outputDimensionality: 1536,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Gemini embedding failed (${response.status}): ${await response.text()}`
    );
  }

  const data = (await response.json()) as {
    embedding?: {
      values?: number[];
    };
  };

  if (!data.embedding?.values?.length) {
    throw new Error("Gemini returned an empty embedding");
  }

  return data.embedding.values;
}

interface AskLLMParams {
  userMessage: string;
  context: string;
  mode: "ask" | "job_match" | "challenge" | "architect";
}

const MODE_INSTRUCTIONS: Record<
  AskLLMParams["mode"],
  string
> = {
  ask: "Answer the visitor's question about Sufyan directly and professionally.",

  job_match:
    "The visitor pasted a job description. Analyze how well Sufyan's portfolio matches it. Give a match percentage and list specific evidence.",

  challenge:
    "Be strict. Only confirm skills explicitly supported by the context.",

  architect:
    "Suggest a technical solution and point to similar past work as evidence.",
};

export async function askLLM({
  userMessage,
  context,
  mode,
}: AskLLMParams) {
  const systemPrompt = `
You are Sufyan AI, a helpful and conversational portfolio assistant for Sufyan Ali.

RULES:
1. Understand the visitor's intent before answering. Give a natural, direct answer instead of repeating the context or listing every source.
2. Answer using ONLY the CONTEXT for claims about Sufyan.
3. Never invent projects, technologies, clients, responsibilities, or experience.
4. For a greeting or a question about Sufyan, introduce him briefly and naturally.
5. For a project question, describe only the requested project and its relevant technologies or purpose.
6. For a technology question, group the relevant technologies by role instead of dumping the entire portfolio.
7. Mention evidence by project or experience name only when it supports the answer; do not force project names into unrelated answers.
8. If the question is unrelated to Sufyan or the context has no answer, say:
"I couldn't find sufficient evidence for that in Sufyan's portfolio."
9. Answer in 2-5 complete, useful sentences. Never stop mid-sentence.

MODE:
${mode}

MODE INSTRUCTION:
${MODE_INSTRUCTIONS[mode]}

CONTEXT:
${context || "(no relevant context retrieved)"}
`;

  const response = await fetch(
    `${GEMINI_API_BASE}/models/gemini-3.6-flash:generateContent?key=${getGeminiKey()}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 800,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Gemini response failed (${response.status}): ${await response.text()}`
    );
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string;
        }>;
      };
    }>;
  };

  return (
    data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("") || ""
  );
}

export default {
  embedText,
  askLLM,
};