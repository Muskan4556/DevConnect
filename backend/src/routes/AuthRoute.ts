import express from "express";
import {
  getMyValidatedUser,
  loginUser,
  logoutUser,
} from "../controllers/AuthController";
import { validateMyUserLoginAuthRequest } from "../middlewares/validator";
import { verifyToken } from "../middlewares/auth";

const router = express.Router();

router.post("/login", validateMyUserLoginAuthRequest, loginUser);
router.get("/validate-token", verifyToken, getMyValidatedUser);
router.post("/logout", logoutUser);

export default router;
