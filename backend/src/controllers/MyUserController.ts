import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

export const createNewUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User(req.body);
    await user.save();

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

    return res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getMyUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById({ _id: req.userId });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json(user.toObject());
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateMyUser = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      password,
      age,
      gender,
      description,
      photoUrl,
      skills,
    } = req.body;

    const user = await User.findById({ _id: req.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (firstName) {
      user.firstName = firstName;
    }
    if (lastName) {
      user.lastName = lastName;
    }
    if (password) {
      user.password = password;
    }
    if (age) {
      user.age = parseInt(age);
    }
    if (gender) {
      user.gender = gender;
    }
    if (description) {
      user.description = description;
    }
    if (photoUrl) {
      user.photoUrl = photoUrl;
    }
    if (skills) {
      user.skills = skills;
    }

    await user.save();

    res.status(200).json({ message: "User updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/*
auth_token=eyJhbGciOiJORSIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzQyZGEzZmIzMzIxZWNiMjBjYjUyZDUiLCJpYXQiOjE3MzI0MzQ0OTUsImV4cCI6MTczMjUyMDg5NX0.E7hCnt7jOC5gMMXTnbIWvc1KV0e1n5SMtx9S2EoE33g; Path=/; HttpOnly; Expires=Mon, 25 Nov 2024 07:48:15 GMT;
*/
