import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import * as bcrypt from "bcrypt";
import Connection from "../models/connection";

const USER_SAFE_DATA = "firstName lastName email age gender description skills";

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
    const user = await User.findById({ _id: req.userId })
      .select(USER_SAFE_DATA)
      .lean();
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({ data: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateMyUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, age, gender, description, photoUrl, skills } =
      req.body;

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

export const updateMyPassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById({ _id: req.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validatePassword = await bcrypt.compare(oldPassword, user.password); // return true or false
    if (!validatePassword) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    if (newPassword) {
      user.password = newPassword;
    }

    await user.save();

    res.status(200).json({
      message: "Password updated",
    });
  } catch {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const updateMyPasswordFromEmail = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const loggedUser = await User.findById(req.userId);
    if (!loggedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }

    if (loggedUser._id.toString() !== userExist._id.toString()) {
      return res.status(401).json({ message: "User not found" });
    }

    loggedUser.password = password;
    await loggedUser.save();

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getMyConnections = async (req: Request, res: Response) => {
  try {
    const user = await User.findById({ _id: req.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userConnection = await Connection.find({
      $or: [
        { fromUserId: user._id, status: "accepted" },
        { toUserId: user._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    if (!userConnection) {
      return res.status(404).json({ message: "No connections found" });
    }

    const connections = userConnection.map((c) => {
      const connectedUser =
        c.fromUserId._id.toString() === user._id.toString()
          ? c.toUserId
          : c.fromUserId;

      return {
        _id: c._id,
        connectedUser,
        status: c.status,
      };
    });

    res.status(200).json({ data: connections });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getMyPendingRequests = async (req: Request, res: Response) => {
  try {
    const user = await User.findById({ _id: req.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userRequest = await Connection.find({
      toUserId: user._id,
      status: "interested",
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    if (!userRequest) {
      return res.status(404).json({ message: "No requests found" });
    }

    const requests = userRequest.map((c) => {
      const requestedUser =
        c.fromUserId._id.toString() === user._id.toString()
          ? c.toUserId
          : c.fromUserId;

      return {
        _id: c._id,
        requestedUser,
        status: c.status,
      };
    });

    res.status(200).json({ data: requests });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getMyFeed = async (req: Request, res: Response) => {
  try {
    const user = await User.findById({ _id: req.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const myConnectionExist = await Connection.find({
      $or: [{ fromUserId: user._id }, { toUserId: user._id }],
    }).select("fromUserId toUserId");

    const hideUserList = new Set();
    myConnectionExist.forEach((connection) => {
      hideUserList.add(connection.fromUserId.toString());
      hideUserList.add(connection.toUserId.toString());
    });

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const query = {
      $and: [
        { _id: { $nin: Array.from(hideUserList) } },
        { _id: { $ne: user._id } },
      ],
    };

    const totalUsers = await User.countDocuments(query);

    const remainingFeed = await User.find(query)
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(pageSize);

    if (!remainingFeed || remainingFeed.length === 0) {
      return res.status(404).json({
        data: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 1,
        },
      });
    }

    res.status(200).json({
      data: remainingFeed,
      pagination: {
        total: totalUsers,
        page,
        pages: Math.ceil(totalUsers / pageSize),
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
