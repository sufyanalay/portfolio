import { useEffect, useState } from "react";
import api from "../../lib/api";

interface ContactSettings {
  email: string;
  phone: string;
  linkedinUrl: string;
  githubUrl: string;
}

export default function Contact() {
  const [settings, setSettings] = useState<ContactSettings | null>(null);

  useEffect(() => {
    api.get("/settings").then((response) => setSettings(response.data.data)).catch(() => setSettings(null));
  }, []);

  return (
    <section id="contact" className="desktop-panel border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5 border-b border-border pb-5">
          <div>
            <p className="mb-2 text-[11px] font-medium tracking-[0.08em] text-primary">CONTACT</p>
            <h2 className="font-heading text-3xl font-semibold text-text-dark md:text-4xl">Let&apos;s work together.</h2>
          </div>
          <p className="font-mono text-[11px] text-text-gray">OPEN TO SOFTWARE ENGINEERING OPPORTUNITIES</p>
        </div>

        <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="max-w-xl text-sm leading-7 text-text-gray">
              I&apos;m available for software engineering roles, freelance projects,
              and product collaborations involving reliable systems, thoughtful
              product development, and scalable application architecture.
            </p>

            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-[10px] font-medium uppercase tracking-wider text-primary">Specialization</p>
                <p className="mt-2 text-sm font-medium text-text-dark">Application Development</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-[10px] font-medium uppercase tracking-wider text-primary">Based in</p>
                <p className="mt-2 text-sm font-medium text-text-dark">Lahore, Pakistan</p>
              </div>
            </div>
          </div>

          <div className="border-l-2 border-primary pl-6">
            <p className="mb-4 text-[10px] font-medium uppercase tracking-wider text-text-gray">Direct contact</p>
            <div className="space-y-4 text-sm">
              {settings?.email && <div><p className="text-[11px] text-text-gray">Email</p><a href={`mailto:${settings.email}`} className="mt-1 block font-medium text-text-dark hover:text-primary">{settings.email}</a></div>}
              {settings?.phone && <div><p className="text-[11px] text-text-gray">Phone</p><a href={`tel:${settings.phone}`} className="mt-1 block font-medium text-text-dark hover:text-primary">{settings.phone}</a></div>}
              <div className="flex flex-wrap gap-4 pt-1">
                {settings?.linkedinUrl && <a href={settings.linkedinUrl} target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">LinkedIn ↗</a>}
                {settings?.githubUrl && <a href={settings.githubUrl} target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">GitHub ↗</a>}
              </div>
              {settings?.email && <a href={`mailto:${settings.email}?subject=Software%20Engineering%20Opportunity`} className="mt-3 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:opacity-90">Send an email</a>}
            </div>
          </div>
        </div>

        <p className="mt-16 border-t border-border pt-5 text-xs text-text-gray">© {new Date().getFullYear()} Sufyan Ali. Software engineering and product development.</p>
      </div>
    </section>
  );
}