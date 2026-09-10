import { useEffect, useState } from "react";
import api from "../../lib/api";
import type { Service } from "../../types/content";

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    api.get("/services").then((res) => setServices(res.data.data)).catch(() => setServices([]));
  }, []);

  return (
    <section id="services" className="desktop-panel border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
        <p className="mb-2 text-[11px] font-medium tracking-[0.08em] text-primary">SERVICES</p>
        <h2 className="mb-3 font-heading text-3xl font-semibold text-text-dark md:text-4xl">What I can build with you</h2>
        <p className="mb-10 max-w-2xl text-sm leading-7 text-text-gray">Focused engineering support from the first system sketch to a reliable production release.</p>
        {services.length === 0 ? (
          <p className="text-[13px] text-text-gray">Services will appear here once added from the admin panel.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <article key={service._id} className="rounded-2xl border border-border bg-background p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-md">
                <span className="font-heading text-3xl font-medium text-secondary">0{index + 1}</span>
                <h3 className="mt-8 text-lg font-medium text-text-dark">{service.label}</h3>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}