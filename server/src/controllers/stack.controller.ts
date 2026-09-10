import { Request, Response } from "express";
import Stack from "../models/Stack";

export const getStacks = async (req: Request, res: Response) => {
  try {
    const stacks = await Stack.find().sort({ order: 1 });
    res.json({ success: true, data: stacks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch stack categories" });
  }
};

export const createStack = async (req: Request, res: Response) => {
  try {
    const stack = await Stack.create(req.body);
    res.status(201).json({ success: true, data: stack });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create stack category" });
  }
};

export const updateStack = async (req: Request, res: Response) => {
  try {
    const stack = await Stack.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!stack) {
      return res.status(404).json({ success: false, message: "Stack category not found" });
    }

    res.json({ success: true, data: stack });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update stack category" });
  }
};

export const deleteStack = async (req: Request, res: Response) => {
  try {
    const stack = await Stack.findByIdAndDelete(req.params.id);

    if (!stack) {
      return res.status(404).json({ success: false, message: "Stack category not found" });
    }

    res.json({ success: true, message: "Stack category deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete stack category" });
  }
};