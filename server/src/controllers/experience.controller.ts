import { Request, Response } from "express";
import Experience from "../models/Experience";

export const getExperiences = async (req: Request, res: Response) => {
  try {
    const experiences = await Experience.find().sort({ order: 1 });
    res.json({ success: true, data: experiences });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch experiences" });
  }
};

export const createExperience = async (req: Request, res: Response) => {
  try {
    const experience = await Experience.create(req.body);
    res.status(201).json({ success: true, data: experience });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create experience" });
  }
};

export const updateExperience = async (req: Request, res: Response) => {
  try {
    const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!experience) {
      return res.status(404).json({ success: false, message: "Experience not found" });
    }

    res.json({ success: true, data: experience });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update experience" });
  }
};

export const deleteExperience = async (req: Request, res: Response) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);

    if (!experience) {
      return res.status(404).json({ success: false, message: "Experience not found" });
    }

    res.json({ success: true, message: "Experience deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete experience" });
  }
};