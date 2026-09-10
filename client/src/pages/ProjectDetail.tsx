import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import api from "../lib/api";
import type { Project } from "../types/project";

import Navbar from "../components/layout/Navbar";
import ProjectGallery from "../components/project/ProjectGallery";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    api
      .get(`/projects/${slug}`)
      .then((res) => {
        setProject(res.data.data);
      })
      .catch(() => {
        setNotFound(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />

        <p className="pt-32 text-center text-[13px] text-text-gray">
          Loading...
        </p>
      </div>
    );
  }

  // Not Found State
  if (notFound || !project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="pt-32 text-center">
          <p className="mb-4 text-[13px] text-text-gray">
            Project not found.
          </p>

          <Link
            to="/"
            className="text-sm text-primary hover:underline"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-4xl px-6 pt-24 pb-20 md:px-8">
        {/* Back Link */}
        <Link
          to="/#work"
          className="text-[12px] text-primary hover:underline"
        >
          ← Back to projects
        </Link>

        {/* Project Title + Status */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-2xl font-medium text-text-dark md:text-3xl">
            {project.name}
          </h1>

          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] ${
              project.status === "Live"
                ? "bg-[#E1F5EE] text-[#085041]"
                : "bg-[#FAECE7] text-[#4A1B0C]"
            }`}
          >
            {project.status}
          </span>
        </div>

        {/* Tagline */}
        <p className="mt-2 text-sm text-text-gray">
          {project.tagline}
        </p>

        {/* Project Gallery */}
        {project.images?.length > 0 && (
          <div className="mt-8">
            <ProjectGallery
              images={project.images}
              name={project.name}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Description */}
          <div className="space-y-4 text-[13px] leading-relaxed text-text-gray md:col-span-2">
            {project.description.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Role */}
            <div>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-primary">
                Role
              </p>

              <p className="text-[13px] text-text-dark">
                {project.role}
              </p>
            </div>

            {/* Tech Stack */}
            <div>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-primary">
                Tech Stack
              </p>

              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-[#F1EFE8] px-2.5 py-1 text-[10px] text-[#444441]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Links */}
            {(project.liveUrl || project.githubUrl) && (
              <div className="flex flex-col gap-2">
                {/* Live Website */}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-primary px-4 py-2 text-center text-[12px] font-medium text-white hover:opacity-90"
                  >
                    View Live
                  </a>
                )}

                {/* GitHub */}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-border px-4 py-2 text-center text-[12px] font-medium text-text-dark hover:bg-surface"
                  >
                    View Code
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Key Features */}
        {project.features?.length > 0 && (
          <div className="mt-10">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-primary">
              Key Features
            </p>

            <ul className="space-y-2 text-[13px] text-text-gray">
              {project.features.map((f, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}