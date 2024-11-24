import express from "express";
import {
  createNewUser,
  getMyUser,
  updateMyUser,
} from "../controllers/MyUserController";
import {
  validateMyUserAuthRequest,
  validateMyUserUpdateRequest,
} from "../middlewares/validator";
import { verifyToken } from "../middlewares/auth";

const router = express.Router();

router.post("/signup", validateMyUserAuthRequest, createNewUser);
router.get("/", verifyToken, getMyUser);
router.put("/", verifyToken, validateMyUserUpdateRequest, updateMyUser);

export default router;
