import { Request, Response } from "express";
import User from "../models/user";
import Connection, { Status } from "../models/connection";

export const sendConnectionRequest = async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findById({ _id: req.userId });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const targetUserId = req.params.toUserId;
    const targetUserExist = await User.findById({ _id: targetUserId });
    if (!targetUserExist) {
      return res.status(404).json({ message: "User not found" });
    }

    const status = req.params.status;

    const existingConnection = await Connection.findOne({
      $or: [
        { fromUserId: currentUser._id, toUserId: targetUserId },
        { fromUserId: targetUserId, toUserId: currentUser._id },
      ],
    });

    if (existingConnection) {
      return res.status(400).json({ message: "Connection already exists" });
    }

    const connection = new Connection({
      fromUserId: currentUser._id,
      toUserId: targetUserId,
      status,
    });

    const data = await connection.save();
    const populatedConnection = await data.populate([
      {
        path: "fromUserId",
        select: "firstName lastName email age gender description skills",
      },
      {
        path: "toUserId",
        select: "firstName lastName email age gender description skills",
      },
    ]);
    res.status(200).json({
      message: `${
        status === "interested"
          ? "Your connection request has been sent successfully."
          : "Action completed successfully."
      }`,
      data: populatedConnection.toObject(),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const reviewConnectionRequest = async (req: Request, res: Response) => {
  try {
    const { requestId, status } = req.params;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connectionExist = await Connection.findOne({
      _id: requestId,
      toUserId: user._id,
      status: "interested",
    });

    if (!connectionExist) {
      return res.status(404).json({ message: "Connection not found" });
    }

    connectionExist.status = status as Status;

    const data = await connectionExist.save();
    const populatedData = await data.populate([
      {
        path: "fromUserId",
        select: "firstName lastName email age gender description skills",
      },
      {
        path: "toUserId",
        select: "firstName lastName email age gender description skills",
      },
    ]);

    res.status(200).json({
      message: `${
        status === "accepted"
          ? "Your connection request has been accepted."
          : "Your connection request has been rejected."
      }`,
      data: populatedData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
