export interface Project {
  _id: string;
  slug: string;
  name: string;
  tagline: string;
  status: "Live" | "In progress";
  role: string;
  tech: string[];
  description: string[];
  features: string[];
  images: string[];
  liveUrl?: string;
  githubUrl?: string;
  order: number;
}