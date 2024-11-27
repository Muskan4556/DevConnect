import express from "express";
import {
  createNewUser,
  getMyFeed,
  getMyConnections,
  getMyPendingRequests,
  getMyUser,
  updateMyPassword,
  updateMyPasswordFromEmail,
  updateMyUser,
} from "../controllers/MyUserController";
import {
  validateMyUserAuthRequest,
  validateMyUserForgetPasswordRequest,
  validateMyUserUpdatePasswordRequest,
  validateMyUserUpdateRequest,
} from "../middlewares/validator";
import { verifyToken } from "../middlewares/auth";

const router = express.Router();

router.post("/signup", validateMyUserAuthRequest, createNewUser);
router.get("/", verifyToken, getMyUser);
router.put("/", verifyToken, validateMyUserUpdateRequest, updateMyUser);
router.patch(
  "/password",
  verifyToken,
  validateMyUserUpdatePasswordRequest,
  updateMyPassword
);
router.patch(
  "/forget-password",
  verifyToken,
  validateMyUserForgetPasswordRequest,
  updateMyPasswordFromEmail
);

router.get("/connections", verifyToken, getMyConnections);
router.get("/requests", verifyToken, getMyPendingRequests);
router.get("/feed", verifyToken, getMyFeed);

export default router;
