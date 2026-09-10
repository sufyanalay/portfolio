import { useEffect, useState } from "react";
import api from "../../lib/api";

interface StackCategory {
  _id: string;
  label: string;
  items: string[];
}

export default function Stack() {
  const [categories, setCategories] = useState<StackCategory[]>([]);

  useEffect(() => {
    api.get("/stack").then((res) => setCategories(res.data.data));
  }, []);

  return (
    <section id="stack" className="desktop-panel border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-14 md:px-8 md:py-28">
        <p className="text-[11px] font-medium tracking-[0.08em] text-primary mb-2">
          TECH STACK
        </p>
        <h2 className="mb-10 font-heading text-2xl font-semibold text-text-dark md:text-3xl">
          Technical Skills
        </h2>

        {categories.length === 0 ? (
          <p className="text-[13px] text-text-gray">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="rounded-[16px] border border-border bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-md"
              >
                <p className="mb-2 text-[10px] uppercase tracking-[0.04em] text-text-gray">
                  {cat.label}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-[10px] bg-[#F1EFE8] px-2.5 py-1 text-[10.5px] text-[#2C2C2A]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}