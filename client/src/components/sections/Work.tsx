import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import type { Project } from "../../types/project";

export default function Work() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/projects").then((res) => {
      setProjects(res.data.data);
      setLoading(false);
    });
  }, []);

  return (
    <section id="work" className="desktop-panel bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
        <p className="text-[11px] font-medium tracking-[0.08em] text-primary mb-2">
          FEATURED PROJECTS
        </p>
        <h2 className="font-heading text-2xl md:text-3xl font-medium text-text-dark mb-2">
          {loading
            ? "Loading projects..."
            : projects.length > 0
            ? `${projects.length} product${projects.length !== 1 ? "s" : ""}, shipped.`
            : "Projects coming soon."}
        </h2>
        <p className="text-[12px] text-text-gray mb-10">
          Click a project to see the full case study — tech stack, role and results.
        </p>

        {!loading && projects.length === 0 ? (
          <p className="text-[13px] text-text-gray">
            Projects will appear here once added from the admin panel.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <Link
                key={project._id}
                to={`/work/${project.slug}`}
                className="group relative overflow-hidden rounded-[16px] border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-800">
                  {project.images?.[0] ? (
                    <img
                      src={project.images[0]}
                      alt={project.name}
                      className="h-full w-full object-cover brightness-90 transition duration-500 group-hover:scale-105 group-hover:brightness-100"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#252525] font-mono text-[11px] text-zinc-500">
                      PROJECT PREVIEW
                    </div>
                  )}
                  <span className="absolute left-4 top-4 font-mono text-xs text-white/80">0{index + 1}</span>
                  <span
                    className={`absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-[9px] ${
                      project.status === "Live"
                        ? "bg-[#E1F5EE] text-[#085041]"
                        : "bg-[#FAECE7] text-[#4A1B0C]"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <div className="p-5 md:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-text-dark">
                        {project.name}
                      </p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.08em] text-primary">
                        {project.role}
                      </p>
                    </div>
                    <span className="pt-1 text-lg text-text-gray transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </div>
                  <p className="mt-4 max-w-lg text-[12px] leading-6 text-text-gray">
                    {project.tagline}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-1.5 border-t border-border pt-4">
                    {project.tech?.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-[#F1EFE8] px-2 py-0.5 text-[9px] text-[#444441]"
                      >
                        {t}
                      </span>
                    ))}
                    {project.tech?.length > 4 && <span className="px-1 py-0.5 text-[9px] text-text-gray">+{project.tech.length - 4}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}