import { Router } from "express";
import authRoutes from "./auth.route"
import messageRoutes from "./message.route"

const router = Router();

router.use("/auth", authRoutes)
router.use("/message", messageRoutes)

export default router;