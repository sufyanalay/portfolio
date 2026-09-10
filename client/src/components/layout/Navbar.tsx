import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Stack", href: "#stack" },
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled || menuOpen
          ? "bg-white/70 backdrop-blur-md border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6 md:px-8">
        {/* Logo */}
        <Link
          to="/#home"
          onClick={(event) => {
            if (window.location.pathname === "/") {
              event.preventDefault();
              document.getElementById("home")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
          className="flex items-center gap-2.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-heading text-sm font-medium text-white shadow-sm">
            S
          </span>

          <span className="hidden sm:inline text-sm font-medium text-text-dark">
            Sufyan Ali
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-7 text-[12px] text-text-gray md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="hover:text-text-dark transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Hire Me */}
          <a
            href="#contact"
            className="hidden rounded-full bg-primary px-5 py-2.5 text-[12px] font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:opacity-90 sm:inline-flex"
          >
            Hire me
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-text-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            <span className="sr-only">Toggle menu</span>

            <div className="w-4 space-y-1">
              <span
                className={`block h-[1.5px] bg-current transition-transform ${
                  menuOpen ? "translate-y-[5px] rotate-45" : ""
                }`}
              />

              <span
                className={`block h-[1.5px] bg-current transition-opacity ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />

              <span
                className={`block h-[1.5px] bg-current transition-transform ${
                  menuOpen ? "-translate-y-[5px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden flex flex-col gap-1 px-6 pb-5 text-sm text-text-gray bg-white/90 backdrop-blur-md">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-2 hover:text-text-dark transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}

          <li className="pt-3">
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="block text-center bg-primary text-white rounded-full py-2.5 font-medium"
            >
              Hire me
            </a>
          </li>
        </ul>
      )}
    </header>
  );
}