import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import type { Journey, Milestone, JourneyStat, Service } from "../../types/content";
import type { Project } from "../../types/project";

const panel = "rounded-2xl border border-border bg-surface p-6";
const input = "mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary";
const emptyProject = { name: "", tagline: "", status: "Live" as Project["status"], role: "", tech: "", description: "", features: "", liveUrl: "", githubUrl: "", images: [] as string[] };
interface ExperienceItem { _id: string; company: string; role: string; duration: string; current: boolean; description: string; highlights: string[]; order: number; }
interface StackCategory { _id: string; label: string; items: string[]; order: number; }
interface SettingsData { aboutHeading: string; profileImage: string; aboutBio: string[]; aboutBadges: string[]; email: string; phone: string; linkedinUrl: string; githubUrl: string; resumeUrl: string; }

export default function Admin() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [stacks, setStacks] = useState<StackCategory[]>([]);
  const [experienceForm, setExperienceForm] = useState({ company: "", role: "", duration: "", description: "", highlights: "", current: false });
  const [stackForm, setStackForm] = useState({ label: "", items: "" });
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [aboutBio, setAboutBio] = useState("");
  const [aboutBadges, setAboutBadges] = useState("");
  const [aboutHeading, setAboutHeading] = useState("Professional Profile");
  const [contactForm, setContactForm] = useState({ email: "", phone: "", linkedinUrl: "", githubUrl: "", resumeUrl: "" });
  const [journey, setJourney] = useState<Journey | null>(null);
  const [newService, setNewService] = useState("");
  const [heading, setHeading] = useState("");
  const [milestones, setMilestones] = useState("[]");
  const [stats, setStats] = useState("[]");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      await api.get("/auth/me");
      setAuthorized(true);
      const [serviceResponse, journeyResponse, projectResponse, experienceResponse, stackResponse, settingsResponse] = await Promise.all([api.get("/services"), api.get("/journey"), api.get("/projects"), api.get("/experience"), api.get("/stack"), api.get("/settings")]);
      setServices(serviceResponse.data.data);
      setProjects(projectResponse.data.data);
      setExperiences(experienceResponse.data.data);
      setStacks(stackResponse.data.data);
      const loadedSettings: SettingsData = settingsResponse.data.data;
      setProfileImage(loadedSettings.profileImage || "");
      setAboutHeading(loadedSettings.aboutHeading || "Professional Profile");
      setAboutBio((loadedSettings.aboutBio || []).join("\n\n"));
      setAboutBadges((loadedSettings.aboutBadges || []).join(", "));
      setContactForm({ email: loadedSettings.email || "", phone: loadedSettings.phone || "", linkedinUrl: loadedSettings.linkedinUrl || "", githubUrl: loadedSettings.githubUrl || "", resumeUrl: loadedSettings.resumeUrl || "" });
      const loadedJourney: Journey = journeyResponse.data.data;
      setJourney(loadedJourney);
      setHeading(loadedJourney.heading);
      setMilestones(JSON.stringify(loadedJourney.milestones, null, 2));
      setStats(JSON.stringify(loadedJourney.stats, null, 2));
    } catch (requestError: any) {
      setAuthorized(false);
      if (requestError.response?.status === 401) navigate("/secure-login");
      else setError(requestError.response?.data?.message || "Unable to load admin content.");
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const addService = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newService.trim()) return;
    try {
      const response = await api.post("/services", { label: newService.trim(), order: services.length });
      setServices((current) => [...current, response.data.data]);
      setNewService("");
      setMessage("Service added.");
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Unable to add service.");
    }
  };

  const removeService = async (id: string) => {
    try {
      await api.delete(`/services/${id}`);
      setServices((current) => current.filter((service) => service._id !== id));
      setMessage("Service removed.");
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Unable to remove service.");
    }
  };

  const uploadImage = async (file: File, onUploaded: (url: string) => void) => {
    const formData = new FormData();
    formData.append("file", file);
    setUploadingImage(true);
    setError("");
    try {
      const response = await api.post("/upload", formData);
      onUploaded(response.data.url);
      setMessage("Image uploaded.");
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Image upload failed. Check Cloudinary settings.");
    } finally {
      setUploadingImage(false);
    }
  };

  const saveProfileImage = async (url: string) => {
    try {
      await api.put("/settings", { profileImage: url });
      setProfileImage(url);
      setMessage("Personal image saved.");
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Unable to save personal image.");
    }
  };

  const saveSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await api.put("/settings", {
        aboutHeading,
        aboutBio: aboutBio.split("\n\n").map((item) => item.trim()).filter(Boolean),
        aboutBadges: aboutBadges.split(",").map((item) => item.trim()).filter(Boolean),
        ...contactForm,
      });
      setMessage("About and contact details saved.");
      setError("");
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Unable to save About and contact details.");
    }
  };

  const addProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await api.post("/projects", {
        ...projectForm,
        tech: projectForm.tech.split(",").map((item) => item.trim()).filter(Boolean),
        description: projectForm.description.split("\n").map((item) => item.trim()).filter(Boolean),
        features: projectForm.features.split("\n").map((item) => item.trim()).filter(Boolean),
        order: projects.length,
      });
      setProjects((current) => [...current, response.data.data]);
      setProjectForm(emptyProject);
      setMessage("Project published.");
      setError("");
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Unable to publish project.");
    }
  };

  const removeProject = async (id: string) => {
    try {
      await api.delete(`/projects/${id}`);
      setProjects((current) => current.filter((project) => project._id !== id));
      setMessage("Project removed.");
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Unable to remove project.");
    }
  };

  const addExperience = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await api.post("/experience", { ...experienceForm, highlights: experienceForm.highlights.split(",").map((item) => item.trim()).filter(Boolean), order: experiences.length });
      setExperiences((current) => [...current, response.data.data]);
      setExperienceForm({ company: "", role: "", duration: "", description: "", highlights: "", current: false });
      setMessage("Experience added.");
    } catch (requestError: any) { setError(requestError.response?.data?.message || "Unable to add experience."); }
  };

  const removeExperience = async (id: string) => {
    try { await api.delete(`/experience/${id}`); setExperiences((current) => current.filter((item) => item._id !== id)); setMessage("Experience removed."); }
    catch (requestError: any) { setError(requestError.response?.data?.message || "Unable to remove experience."); }
  };

  const addStack = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await api.post("/stack", { label: stackForm.label, items: stackForm.items.split(",").map((item) => item.trim()).filter(Boolean), order: stacks.length });
      setStacks((current) => [...current, response.data.data]); setStackForm({ label: "", items: "" }); setMessage("Stack category added.");
    } catch (requestError: any) { setError(requestError.response?.data?.message || "Unable to add stack category."); }
  };

  const removeStack = async (id: string) => {
    try { await api.delete(`/stack/${id}`); setStacks((current) => current.filter((item) => item._id !== id)); setMessage("Stack category removed."); }
    catch (requestError: any) { setError(requestError.response?.data?.message || "Unable to remove stack category."); }
  };

  const saveJourney = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const parsedMilestones = JSON.parse(milestones) as Milestone[];
      const parsedStats = JSON.parse(stats) as JourneyStat[];
      const response = await api.put("/journey", { heading, milestones: parsedMilestones, stats: parsedStats });
      setJourney(response.data.data);
      setMessage("Journey saved.");
      setError("");
    } catch (requestError: any) {
      setError(requestError instanceof SyntaxError ? "Milestones and stats must be valid JSON." : requestError.response?.data?.message || "Unable to save journey.");
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      navigate("/secure-login");
    }
  };

  if (checkingAuth || !authorized) {
    return <main className="flex min-h-screen items-center justify-center bg-background text-sm text-text-gray">Checking admin access...</main>;
  }

  return (
    <main className="min-h-screen bg-background px-6 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div><Link to="/" className="text-sm text-primary hover:underline">← Portfolio</Link><h1 className="mt-3 font-heading text-3xl font-medium text-text-dark">Content dashboard</h1></div>
          <button onClick={logout} className="rounded-xl border border-border px-4 py-2 text-sm text-text-dark hover:bg-surface">Sign out</button>
        </header>
        {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {message && <p className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</p>}
        <section className={`${panel} mb-6`}>
          <p className="text-[11px] font-medium tracking-[0.08em] text-primary">PROFILE IMAGE</p>
          <h2 className="mt-2 font-heading text-2xl font-medium text-text-dark">Your personal photo</h2>
          <div className="mt-5 flex flex-wrap items-center gap-5">
            {profileImage && <img src={profileImage} alt="Current profile" className="h-28 w-28 rounded-2xl object-cover" />}
            <div><input type="file" accept="image/*" disabled={uploadingImage} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadImage(file, (url) => void saveProfileImage(url)); event.target.value = ""; }} className="block text-xs text-text-gray file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-xs file:font-medium file:text-white" /><p className="mt-2 text-xs text-text-gray">Upload your photo here. Maximum 5MB.</p></div>
          </div>
        </section>
        <form onSubmit={saveSettings} className={`${panel} mb-6`}>
          <p className="text-[11px] font-medium tracking-[0.08em] text-primary">ABOUT & CONTACT</p>
          <h2 className="mt-2 font-heading text-2xl font-medium text-text-dark">Profile details</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="text-xs font-medium text-text-dark md:col-span-2">About heading<input required value={aboutHeading} onChange={(event) => setAboutHeading(event.target.value)} className={input} /></label>
            <label className="text-xs font-medium text-text-dark md:col-span-2">About bio <span className="font-normal text-text-gray">(separate paragraphs with a blank line)</span><textarea rows={7} value={aboutBio} onChange={(event) => setAboutBio(event.target.value)} className={`${input} resize-y`} /></label>
            <label className="text-xs font-medium text-text-dark md:col-span-2">About badges <span className="font-normal text-text-gray">(comma separated)</span><input value={aboutBadges} onChange={(event) => setAboutBadges(event.target.value)} className={input} /></label>
            <label className="text-xs font-medium text-text-dark">Email<input type="email" value={contactForm.email} onChange={(event) => setContactForm({ ...contactForm, email: event.target.value })} className={input} /></label>
            <label className="text-xs font-medium text-text-dark">Phone<input value={contactForm.phone} onChange={(event) => setContactForm({ ...contactForm, phone: event.target.value })} className={input} /></label>
            <label className="text-xs font-medium text-text-dark">LinkedIn URL<input type="url" value={contactForm.linkedinUrl} onChange={(event) => setContactForm({ ...contactForm, linkedinUrl: event.target.value })} className={input} /></label>
            <label className="text-xs font-medium text-text-dark">GitHub URL<input type="url" value={contactForm.githubUrl} onChange={(event) => setContactForm({ ...contactForm, githubUrl: event.target.value })} className={input} /></label>
            <label className="text-xs font-medium text-text-dark">Resume URL<input type="url" value={contactForm.resumeUrl} onChange={(event) => setContactForm({ ...contactForm, resumeUrl: event.target.value })} className={input} /></label>
          </div>
          <button className="mt-5 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white">Save profile details</button>
        </form>
        <div className="grid gap-6 lg:grid-cols-2">
          <section className={panel}>
            <p className="text-[11px] font-medium tracking-[0.08em] text-primary">SERVICES</p>
            <h2 className="mt-2 font-heading text-2xl font-medium text-text-dark">Offerings</h2>
            <div className="mt-6 space-y-2">{services.map((service) => <div key={service._id} className="flex items-center justify-between rounded-xl bg-background px-4 py-3 text-sm"><span>{service.label}</span><button onClick={() => void removeService(service._id)} className="text-xs text-red-600 hover:underline">Remove</button></div>)}</div>
            <form onSubmit={addService} className="mt-5 flex gap-2"><input required value={newService} onChange={(event) => setNewService(event.target.value)} placeholder="New service" className={input.replace("mt-2 ", "")} /><button className="shrink-0 rounded-xl bg-primary px-4 text-sm font-medium text-white">Add</button></form>
          </section>
          <form onSubmit={saveJourney} className={panel}>
            <p className="text-[11px] font-medium tracking-[0.08em] text-primary">JOURNEY</p>
            <h2 className="mt-2 font-heading text-2xl font-medium text-text-dark">Timeline and stats</h2>
            <label className="mt-6 block text-xs font-medium text-text-dark">Heading<input required value={heading} onChange={(event) => setHeading(event.target.value)} className={input} /></label>
            <label className="mt-5 block text-xs font-medium text-text-dark">Milestones JSON<textarea required value={milestones} onChange={(event) => setMilestones(event.target.value)} rows={9} className={`${input} font-mono text-xs`} /></label>
            <label className="mt-5 block text-xs font-medium text-text-dark">Stats JSON<textarea required value={stats} onChange={(event) => setStats(event.target.value)} rows={6} className={`${input} font-mono text-xs`} /></label>
            <button className="mt-5 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white">Save journey</button>
            {journey && <p className="mt-3 text-xs text-text-gray">Last loaded from the portfolio database.</p>}
          </form>
        </div>
        <section className={`${panel} mt-6`}>
          <p className="text-[11px] font-medium tracking-[0.08em] text-primary">PROJECTS</p>
          <h2 className="mt-2 font-heading text-2xl font-medium text-text-dark">Publish a project</h2>
          <form onSubmit={addProject} className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="text-xs font-medium text-text-dark">Project name<input required value={projectForm.name} onChange={(event) => setProjectForm({ ...projectForm, name: event.target.value })} className={input} /></label>
            <label className="text-xs font-medium text-text-dark">Tagline<input required value={projectForm.tagline} onChange={(event) => setProjectForm({ ...projectForm, tagline: event.target.value })} className={input} /></label>
            <label className="text-xs font-medium text-text-dark">Role<input required value={projectForm.role} onChange={(event) => setProjectForm({ ...projectForm, role: event.target.value })} className={input} /></label>
            <label className="text-xs font-medium text-text-dark">Status<select value={projectForm.status} onChange={(event) => setProjectForm({ ...projectForm, status: event.target.value as Project["status"] })} className={input}><option>Live</option><option>In progress</option></select></label>
            <label className="text-xs font-medium text-text-dark">Tech stack <span className="font-normal text-text-gray">(comma separated)</span><input required value={projectForm.tech} onChange={(event) => setProjectForm({ ...projectForm, tech: event.target.value })} className={input} /></label>
            <label className="text-xs font-medium text-text-dark">Live URL<input type="url" value={projectForm.liveUrl} onChange={(event) => setProjectForm({ ...projectForm, liveUrl: event.target.value })} className={input} /></label>
            <label className="text-xs font-medium text-text-dark md:col-span-2">Description <span className="font-normal text-text-gray">(one paragraph per line)</span><textarea required rows={4} value={projectForm.description} onChange={(event) => setProjectForm({ ...projectForm, description: event.target.value })} className={`${input} resize-y`} /></label>
            <label className="text-xs font-medium text-text-dark md:col-span-2">Features <span className="font-normal text-text-gray">(one feature per line)</span><textarea rows={3} value={projectForm.features} onChange={(event) => setProjectForm({ ...projectForm, features: event.target.value })} className={`${input} resize-y`} /></label>
            <label className="text-xs font-medium text-text-dark">GitHub URL<input type="url" value={projectForm.githubUrl} onChange={(event) => setProjectForm({ ...projectForm, githubUrl: event.target.value })} className={input} /></label>
            <div className="text-xs font-medium text-text-dark">
              Project images
              <input type="file" accept="image/*" disabled={uploadingImage} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadImage(file, (url) => setProjectForm((current) => ({ ...current, images: [...current.images, url] }))); event.target.value = ""; }} className="mt-2 block w-full text-xs text-text-gray file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-xs file:font-medium file:text-white" />
              <p className="mt-2 font-normal text-text-gray">{uploadingImage ? "Uploading..." : "Choose one image at a time. Maximum 5MB."}</p>
              {projectForm.images.length > 0 && <div className="mt-3 grid grid-cols-3 gap-2">{projectForm.images.map((image) => <div key={image} className="relative"><img src={image} alt="Project preview" className="h-20 w-full rounded-lg object-cover" /><button type="button" onClick={() => setProjectForm((current) => ({ ...current, images: current.images.filter((item) => item !== image) }))} className="absolute right-1 top-1 rounded bg-black/70 px-1.5 text-xs text-white">×</button></div>)}</div>}
            </div>
            <div className="flex items-end"><button disabled={uploadingImage} className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white disabled:opacity-60">Publish project</button></div>
          </form>
          <div className="mt-8 border-t border-border pt-6"><p className="text-xs font-medium uppercase tracking-wider text-text-gray">Published projects</p><div className="mt-3 space-y-2">{projects.map((project) => <div key={project._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-background px-4 py-3 text-sm"><span><strong>{project.name}</strong><span className="ml-2 text-xs text-text-gray">{project.images.length} image{project.images.length === 1 ? "" : "s"}</span></span><button type="button" onClick={() => void removeProject(project._id)} className="text-xs text-red-600 hover:underline">Remove</button></div>)}</div></div>
        </section>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className={panel}>
            <p className="text-[11px] font-medium tracking-[0.08em] text-primary">EXPERIENCE</p>
            <h2 className="mt-2 font-heading text-2xl font-medium text-text-dark">Add a role</h2>
            <form onSubmit={addExperience} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-medium text-text-dark">Company<input required value={experienceForm.company} onChange={(event) => setExperienceForm({ ...experienceForm, company: event.target.value })} className={input} /></label><label className="text-xs font-medium text-text-dark">Role<input required value={experienceForm.role} onChange={(event) => setExperienceForm({ ...experienceForm, role: event.target.value })} className={input} /></label></div>
              <label className="block text-xs font-medium text-text-dark">Duration<input required placeholder="2023 - Present" value={experienceForm.duration} onChange={(event) => setExperienceForm({ ...experienceForm, duration: event.target.value })} className={input} /></label>
              <label className="block text-xs font-medium text-text-dark">Description<textarea required rows={3} value={experienceForm.description} onChange={(event) => setExperienceForm({ ...experienceForm, description: event.target.value })} className={`${input} resize-y`} /></label>
              <label className="block text-xs font-medium text-text-dark">Highlights <span className="font-normal text-text-gray">(comma separated)</span><input value={experienceForm.highlights} onChange={(event) => setExperienceForm({ ...experienceForm, highlights: event.target.value })} className={input} /></label>
              <label className="flex items-center gap-2 text-xs font-medium text-text-dark"><input type="checkbox" checked={experienceForm.current} onChange={(event) => setExperienceForm({ ...experienceForm, current: event.target.checked })} /> Current role</label>
              <button className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white">Add experience</button>
            </form>
            <div className="mt-6 space-y-2">{experiences.map((item) => <div key={item._id} className="flex items-center justify-between gap-3 rounded-xl bg-background px-4 py-3 text-sm"><span><strong>{item.role}</strong><span className="ml-2 text-xs text-text-gray">{item.company}</span></span><button type="button" onClick={() => void removeExperience(item._id)} className="text-xs text-red-600 hover:underline">Remove</button></div>)}</div>
          </section>
          <section className={panel}>
            <p className="text-[11px] font-medium tracking-[0.08em] text-primary">TECH STACK</p>
            <h2 className="mt-2 font-heading text-2xl font-medium text-text-dark">Add a category</h2>
            <form onSubmit={addStack} className="mt-6 space-y-4"><label className="block text-xs font-medium text-text-dark">Category<input required placeholder="Application Development" value={stackForm.label} onChange={(event) => setStackForm({ ...stackForm, label: event.target.value })} className={input} /></label><label className="block text-xs font-medium text-text-dark">Technologies <span className="font-normal text-text-gray">(comma separated)</span><input required placeholder="C#, APIs, SQL Server" value={stackForm.items} onChange={(event) => setStackForm({ ...stackForm, items: event.target.value })} className={input} /></label><button className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white">Add category</button></form>
            <div className="mt-6 space-y-2">{stacks.map((item) => <div key={item._id} className="flex items-center justify-between gap-3 rounded-xl bg-background px-4 py-3 text-sm"><span><strong>{item.label}</strong><span className="ml-2 text-xs text-text-gray">{item.items.join(", ")}</span></span><button type="button" onClick={() => void removeStack(item._id)} className="text-xs text-red-600 hover:underline">Remove</button></div>)}</div>
          </section>
        </div>
      </div>
    </main>
  );
}