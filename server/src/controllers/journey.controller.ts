import { Request, Response } from "express";
import Journey from "../models/Journey";

export const getJourney = async (req: Request, res: Response) => {
  try {
    let journey = await Journey.findOne();

    if (!journey) {
      journey = await Journey.create({});
    }

    res.json({ success: true, data: journey });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch journey" });
  }
};

export const updateJourney = async (req: Request, res: Response) => {
  try {
    let journey = await Journey.findOne();

    if (!journey) {
      journey = await Journey.create(req.body);
    } else {
      journey = await Journey.findByIdAndUpdate(journey._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    res.json({ success: true, data: journey });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update journey" });
  }
};