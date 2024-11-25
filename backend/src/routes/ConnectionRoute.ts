import express from "express";
import { verifyToken } from "../middlewares/auth";
import {
  sendConnectionRequest,
  reviewConnectionRequest,
} from "../controllers/ConnectionController";
import {
  validateReviewConnectionRequest,
  validateSendConnectionRequest,
} from "../middlewares/validator";

const router = express.Router();

router.post(
  "/send/:status/:toUserId",
  verifyToken,
  validateSendConnectionRequest,
  sendConnectionRequest
);
router.post(
  "/review/:status/:requestId",
  verifyToken,
  validateReviewConnectionRequest,
  reviewConnectionRequest
);

router.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default router;
