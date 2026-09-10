import { useEffect, useState } from "react";
import api from "../../lib/api";
import type { Journey as JourneyData } from "../../types/content";

export default function Journey() {
  const [journey, setJourney] = useState<JourneyData | null>(null);

  useEffect(() => {
    api.get("/journey").then((res) => setJourney(res.data.data)).catch(() => setJourney(null));
  }, []);

  return (
    <section id="journey" className="desktop-panel border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
        <p className="mb-2 text-[11px] font-medium tracking-[0.08em] text-primary">JOURNEY</p>
        <h2 className="mb-12 max-w-2xl font-heading text-3xl font-semibold text-text-dark md:text-4xl">
          {journey?.heading || "From first commit to production systems"}
        </h2>
        {!journey ? <p className="text-[13px] text-text-gray">Loading journey...</p> : (
          <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
            <div className="relative space-y-8 border-l border-border pl-7">
              {journey.milestones.map((milestone) => (
                <article key={`${milestone.year}-${milestone.title}`} className="relative">
                  <span className={`absolute -left-[37px] top-1.5 h-4 w-4 rounded-full border-4 border-background ${milestone.current ? "bg-primary" : "bg-secondary"}`} />
                  <p className="text-xs font-medium text-primary">{milestone.year}</p>
                  <h3 className="mt-1 text-lg font-medium text-text-dark">{milestone.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-7 text-text-gray">{milestone.description}</p>
                </article>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 self-start">
              {journey.stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border bg-surface p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <p className="font-heading text-2xl font-medium text-text-dark">{stat.value}</p>
                  <p className="mt-1 text-[11px] leading-5 text-text-gray">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}