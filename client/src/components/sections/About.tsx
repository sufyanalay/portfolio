import { useEffect, useState } from "react";
import api from "../../lib/api";

const CATEGORIES = [
  { label: "Enterprise", desc: "Leasing, POS, distribution ERP" },
  { label: "Gaming", desc: "Wallets, transaction integrity" },
  { label: "AI", desc: "Assistants in real workflows" },
  { label: "SaaS", desc: "Subscriptions, dashboards, billing" },
  { label: "Web Platforms", desc: "Business sites, catalogs" },
];

interface Settings {
  aboutHeading: string;
  aboutBio: string[];
  aboutBadges: string[];
}

export default function About() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    api.get("/settings").then((res) => setSettings(res.data.data));
  }, []);

  return (
    <section id="about" className="desktop-panel border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-14 md:px-8 md:py-28">
        <p className="text-[11px] font-medium tracking-[0.08em] text-primary mb-2">
          ABOUT
        </p>
        <h2 className="mb-3 font-heading text-2xl font-semibold text-text-dark md:text-3xl">
          {settings?.aboutHeading || "Professional Profile"}
        </h2>

        {settings?.aboutBadges && settings.aboutBadges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {settings.aboutBadges.map((badge) => (
              <span
                key={badge}
                className="text-[10px] bg-[#F1EFE8] text-[#444441] px-3 py-1 rounded-full"
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        <div className="max-w-2xl text-[13px] md:text-sm leading-loose text-text-gray space-y-4">
          {settings?.aboutBio && settings.aboutBio.length > 0 ? (
            settings.aboutBio.map((para, i) => <p key={i}>{para}</p>)
          ) : (
            <p>
              I am a software engineer focused on building dependable digital
              products, scalable application architecture, and clear technical
              solutions for real business needs. I work across modern server,
              database, and interface technologies when a product needs full
              ownership from idea to delivery.
            </p>
          )}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.label}
              className="rounded-[16px] border border-border bg-surface p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-[11px] font-medium text-text-dark mb-1">
                {cat.label}
              </p>
              <p className="text-[9px] text-text-gray leading-snug">
                {cat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}