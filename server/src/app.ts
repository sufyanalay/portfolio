import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import settingsRoutes from "./routes/settings.routes";
import experienceRoutes from "./routes/experience.routes";
import journeyRoutes from "./routes/journey.routes";
import testimonialRoutes from "./routes/testimonial.routes";
import serviceRoutes from "./routes/service.routes";
import stackRoutes from "./routes/stack.routes";
import uploadRoutes from "./routes/upload.routes";
import chatRoutes from "./routes/chat.routes";


dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/journey", journeyRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/stack", stackRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/chat", chatRoutes);



app.get("/", (req, res) => {
  res.send("Sufyan Portfolio API is running");
});

export default app;