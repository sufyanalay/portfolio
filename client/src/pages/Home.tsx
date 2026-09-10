import Navbar from "../components/layout/Navbar";
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Experience from "../components/sections/Experience";
import Stack from "../components/sections/Stack";
import Work from "../components/sections/Work";
import Services from "../components/sections/Services";
import Journey from "../components/sections/Journey";
import Contact from "../components/sections/Contact";
import AskSufyanAI from "../components/sections/AskSufyanAI";
export default function Home() {
  return (
    <div className="desktop-shell min-h-screen bg-background">
      <Navbar />

      <main className="desktop-track">
        <Hero />
        <About />
        <Experience />
        <Stack />
        <Work />
        <Services />
        <Journey />
        <Contact />
        <AskSufyanAI />
      </main>

      {/* Footer — coming next */}
    </div>
  );
}