import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import * as bcrypt from "bcrypt";

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Incorrect email or password" });
    }

    const validatePassword = await bcrypt.compare(password, user.password); // return true or false
    if (!validatePassword) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    // token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1d" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1
    });

    return res.status(200).json({
      userId: user._id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getMyValidatedUser = async (req: Request, res: Response) => {
  try {
    return res.status(200).send({ userId: req.userId });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  res.cookie("auth_token", "", { maxAge: 0 });
  res.send("Logout successfully");
};
