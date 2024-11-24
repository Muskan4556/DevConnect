import express from "express";
import { getAllUser } from "../controllers/UserController";
import { verifyToken } from "../middlewares/auth";

const router = express.Router();

router.get("/feed", verifyToken, getAllUser);

export default router;
