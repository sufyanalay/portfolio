import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import api from "../../lib/api";

const STACK_BADGES = [
  {
    label: "MERN Stack",
    color: "text-violet-700 bg-violet-50 border-violet-100",
  },
  {
    label: "ASP.NET Core 10",
    color: "text-emerald-700 bg-emerald-50 border-emerald-100",
  },
  {
    label: "Node.js & Express",
    color: "text-text-gray bg-white border-border",
  },
  {
    label: "C# & Web APIs",
    color: "text-cyan-700 bg-cyan-50 border-cyan-100",
  },
  {
    label: "MongoDB",
    color: "text-green-700 bg-green-50 border-green-100",
  },
  {
    label: "SQL Server",
    color: "text-amber-700 bg-amber-50 border-amber-100",
  },
];

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function Hero() {
  const [profileImage, setProfileImage] = useState("/sufyan4.png");
  const [resumeUrl, setResumeUrl] = useState("/resume.pdf");

  useEffect(() => {
    api
      .get("/settings")
      .then((response) => {
        if (response.data.data.profileImage) {
          setProfileImage(response.data.data.profileImage);
        }

        if (response.data.data.resumeUrl) {
          setResumeUrl(response.data.data.resumeUrl);
        }
      })
      .catch(() => undefined);
  }, []);

  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-border bg-background pt-[72px]"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FDF0E6] via-background to-[#E8F1FA]" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-secondary/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#1E2533 1px, transparent 1px), linear-gradient(90deg, #1E2533 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Main Hero */}
      <div className="relative mx-auto flex max-w-6xl flex-col px-6 md:min-h-[650px] md:flex-row md:items-center md:px-8">
        {/* Left Content */}
        <div className="order-1 flex-1 pt-10 pb-0 text-center md:order-1 md:py-0 md:text-left">
          {/* Availability */}
          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-4 py-1.5 text-[12px] text-text-gray shadow-sm backdrop-blur-sm"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Available for work · Lahore, Pakistan
          </motion.span>

          {/* Hello */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.05}
            className="mb-2 text-[12px] tracking-[0.15em] text-text-gray"
          >
            HELLO, I'M
          </motion.p>

          {/* Name */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.1}
            className="font-heading text-5xl font-semibold leading-[1.05] tracking-tight text-text-dark md:text-6xl lg:text-7xl"
          >
            SUFYAN ALI
          </motion.h1>

          {/* Role */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.15}
            className="mt-3 mb-2 font-heading text-base tracking-[0.08em] text-primary md:text-xl"
          >
            FULL-STACK ENGINEER · BUILDING BEYOND THE UI
          </motion.p>

          {/* Code Tagline */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.2}
            className="mb-4 inline-block rounded-lg bg-[#1E2533]/[0.04] px-3 py-1.5 font-mono text-[11.5px] text-text-gray/80 md:text-[12.5px]"
          >
            {"async function buildSystems() { "}
            <span className="font-medium text-primary">
              return reliable APIs
            </span>
            {" }"}
          </motion.p>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.25}
            className="mx-auto max-w-md text-[13px] leading-relaxed text-text-gray md:mx-0 md:max-w-lg md:text-base"
          >
            Full-stack engineer working across the MERN stack and ASP.NET
            Core 10 — building reliable APIs, scalable systems, and
            cloud-ready architecture for real business products.
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.3}
            className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start"
          >
            
              href="#work"
              className="group relative overflow-hidden rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30"
            <a>
              View My Work
            </a>

            
              href={resumeUrl}
              download
              className="rounded-full border border-border bg-white px-6 py-3 text-sm font-medium text-text-dark shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            <a>
              Download Resume
            </a>

            
              href="#contact"
              className="rounded-full border border-border bg-transparent px-6 py-3 text-sm font-medium text-text-dark transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
            <a>
              Hire Me
            </a>
          </motion.div>

          {/* Tech Stack Badges */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.35}
            className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start"
          >
            {STACK_BADGES.map((badge) => (
              <span
                key={badge.label}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-medium shadow-sm ${badge.color}`}
              >
                {badge.label}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right Image */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative order-2 flex w-full flex-1 items-end justify-center pb-0 pt-6 md:order-2 md:justify-end md:py-0"
        >
          <div className="absolute bottom-0 right-1/2 h-[260px] w-[260px] translate-x-1/2 rounded-full bg-secondary/15 blur-[80px] md:right-10 md:h-[420px] md:w-[420px] md:translate-x-0 md:blur-[100px]" />
          <div className="absolute bottom-0 right-1/2 hidden h-[85%] w-[85%] translate-x-1/2 rounded-[32px] border border-white/60 bg-white/30 backdrop-blur-sm md:right-6 md:block md:translate-x-0" />
          <div className="relative mx-auto mb-0 h-[320px] w-full max-w-[260px] drop-shadow-2xl sm:h-[380px] sm:max-w-[300px] md:h-[650px] md:max-w-[500px]">
            <img
              src={profileImage}
              alt="Sufyan Ali"
              className="h-full w-full object-contain object-bottom"
            />
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
          delay: 0.8,
        }}
        className="relative hidden pb-6 md:flex md:justify-center"
      >
        <a
          href="#about"
          aria-label="Scroll to About section"
          className="flex flex-col items-center gap-1.5 text-text-gray transition-colors hover:text-primary"
        >
          <span className="text-[10px] tracking-[0.15em]">SCROLL</span>
          <span className="h-8 w-[1px] animate-pulse bg-current" />
        </a>
      </motion.div>
    </section>
  );
}