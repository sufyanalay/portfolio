import { Request, Response } from "express";
import Project from "../models/Project";
import { slugify } from "../utils/slugify";

// GET all projects
export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch projects" });
  }
};

// GET single project by slug
export const getProjectBySlug = async (req: Request, res: Response) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch project" });
  }
};

// CREATE project
export const createProject = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const project = await Project.create({
      ...body,
      slug: body.slug || slugify(body.name),
    });

    res.status(201).json({ success: true, data: project });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "A project with this slug already exists" });
    }
    res.status(500).json({ success: false, message: "Failed to create project" });
  }
};

// UPDATE project
export const updateProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update project" });
  }
};

// DELETE project
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.json({ success: true, message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete project" });
  }
};