import { Router } from "express";
import { login, logout, signup, getMe } from "../controllers/auth.controllers";
import { protectRoute } from "../middlewares";

const router = Router();

router.get("/me", protectRoute, getMe);
router.post("/login", login)
router.post("/signup", signup)
router.post("/logout", logout)

export default router;