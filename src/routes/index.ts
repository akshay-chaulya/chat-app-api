import { Router } from "express";
import authRoutes from "./auth.route"
import messageRoutes from "./message.route"
import usersRoutes from "./users.route"

const router = Router();

router.use("/auth", authRoutes)
router.use("/users", usersRoutes)
router.use("/messages", messageRoutes)

export default router;