import { useEffect, useState } from "react";
import api from "../../lib/api";

const STACK_BADGES = [
  { label: ".NET / ASP.NET Core", color: "text-emerald-700 bg-emerald-50" },
  { label: "C# & Web APIs", color: "text-text-gray bg-white" },
  { label: "Backend Engineer", color: "text-text-gray bg-white" },
  { label: "SQL Server", color: "text-amber-700 bg-amber-50" },
  { label: "Entity Framework", color: "text-cyan-700 bg-cyan-50" },
  { label: "React / TypeScript", color: "text-violet-700 bg-violet-50" },
];

export default function Hero() {
  const [profileImage, setProfileImage] = useState("/sufyan4.png");
  const [resumeUrl, setResumeUrl] = useState("/resume.pdf");

  useEffect(() => {
    api.get("/settings").then((response) => {
      if (response.data.data.profileImage) setProfileImage(response.data.data.profileImage);
      if (response.data.data.resumeUrl) setResumeUrl(response.data.data.resumeUrl);
    }).catch(() => undefined);
  }, []);

  return (
    <section
      id="home"
      className="desktop-panel overflow-hidden border-b border-border bg-gradient-to-br from-[#FBEEE6] via-background to-[#E9F2FA] pt-[72px]"
    >
      <div className="mx-auto flex max-w-6xl flex-col px-6 md:min-h-[650px] md:flex-row md:items-center md:px-8">
        {/* Left Content */}
        <div className="order-1 flex-1 pt-10 pb-0 text-center md:order-1 md:py-0 md:text-left">
          {/* Availability */}
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[12px] text-text-gray shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Available for work · Lahore, Pakistan
          </span>

          {/* Intro */}
          <p className="mb-2 text-[12px] tracking-[0.1em] text-text-gray">
            HELLO, I&apos;M
          </p>

          {/* Name */}
          <h1 className="font-heading text-4xl font-semibold leading-[1.08] text-text-dark md:text-6xl">
            SUFYAN ALI
          </h1>

          {/* Role */}
          <p className="mt-3 mb-2 font-heading text-base tracking-[0.05em] text-primary md:text-xl">
            .NET & BACKEND DEVELOPER
          </p>

          {/* Code Line */}
          <p className="mb-4 font-mono text-[11.5px] text-text-gray/70 md:text-[12.5px]">
            {"public async Task BuildSystems() { "}
            <span className="text-primary">return reliable APIs</span>
            {" }"}
          </p>

          {/* Description */}
          <p className="mx-auto max-w-md text-[13px] leading-relaxed text-text-gray md:mx-0 md:max-w-lg md:text-base">
            Building maintainable backend systems with C#, ASP.NET Core,
            Web APIs, SQL Server, and cloud-ready architecture for real
            business products.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <a
              href="#work"
              className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:opacity-90"
            >
              View My Work
            </a>

            <a
              href={resumeUrl}
              download
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-text-dark shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Download Resume
            </a>

            <a
              href="#contact"
              className="rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-text-dark shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50"
            >
              Hire Me
            </a>
          </div>

          {/* Stack Badges */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
            {STACK_BADGES.map((badge) => (
              <span
                key={badge.label}
                className={`rounded-full px-3 py-1.5 text-[11px] shadow-sm ${badge.color}`}
              >
                {badge.label}
              </span>
            ))}
          </div>
        </div>

        {/* Right Image */}
        <div className="relative order-2 flex w-full flex-1 items-end justify-center pb-0 pt-6 md:order-2 md:justify-end md:py-0">
          {/* Background Glow */}
          <div className="absolute bottom-0 right-1/2 h-[260px] w-[260px] translate-x-1/2 rounded-full bg-secondary/15 blur-[80px] md:right-10 md:h-[420px] md:w-[420px] md:translate-x-0 md:blur-[100px]" />

          {/* Profile Image */}
          <div className="relative mx-auto mb-0 h-[320px] w-full max-w-[260px] sm:h-[380px] sm:max-w-[300px] md:h-[650px] md:max-w-[500px] md:translate-y-3">
            <img
              src={profileImage}
              alt="Sufyan Ali"
              className="h-full w-full object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </section>
  );
}