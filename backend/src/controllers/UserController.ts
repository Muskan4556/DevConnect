import { Request, Response } from "express";
import User from "../models/user";

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const allUser = await User.find();
    if (!allUser || allUser.length === 0) {
      return res.status(404).json({ message: "No user found" });
    }

    res.status(200).json(allUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
