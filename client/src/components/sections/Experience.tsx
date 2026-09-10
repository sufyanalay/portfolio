import { useEffect, useState } from "react";
import api from "../../lib/api";

interface ExperienceItem {
  _id: string;
  company: string;
  role: string;
  duration: string;
  current: boolean;
  description: string;
  highlights: string[];
}

export default function Experience() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);

  useEffect(() => {
    api.get("/experience").then((res) => setExperiences(res.data.data));
  }, []);

  const dotColors = ["bg-primary", "bg-secondary"];

  return (
    <section id="experience" className="desktop-panel border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-14 md:px-8 md:py-28">
        <p className="mb-2 text-[11px] font-medium tracking-[0.08em] text-primary">
          EXPERIENCE
        </p>

        <h2 className="mb-3 font-heading text-3xl font-semibold text-text-dark md:text-4xl">
          Professional Experience
        </h2>

        <p className="mb-12 max-w-2xl text-sm leading-7 text-text-gray">
          A record of building enterprise software, practical digital products,
          and cloud-ready applications with a focus on quality and long-term
          maintainability.
        </p>

        {experiences.length === 0 ? (
          <p className="text-[13px] text-text-gray">Loading...</p>
        ) : (
          <div className="relative mx-auto max-w-3xl pl-8">
            <div className="absolute left-[12px] top-2 bottom-2 w-[2px] rounded-full bg-border" />

            <div className="space-y-8">
              {experiences.map((exp, i) => (
                <div key={exp._id} className="relative">
                  <span
                    className={`absolute -left-8 top-2 h-5 w-5 rounded-full border-4 border-background ${
                      dotColors[i % dotColors.length]
                    }`}
                  />

                  <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-text-dark">
                          {exp.role}
                        </h3>
                        <p className="mt-1 text-sm text-primary">
                          {exp.company}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-text-gray">
                          {exp.duration}
                        </span>

                        {exp.current && (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-[10px] font-medium text-green-700">
                            Current
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="mt-5 text-sm leading-7 text-text-gray">
                      {exp.description}
                    </p>

                    {exp.highlights?.length > 0 && (
                      <div className="mt-5 rounded-xl bg-background p-4">
                        <p className="text-xs font-medium uppercase tracking-wider text-primary">
                          Technologies
                        </p>
                        <p className="mt-2 text-sm leading-6 text-text-gray">
                          {exp.highlights.join(" • ")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}