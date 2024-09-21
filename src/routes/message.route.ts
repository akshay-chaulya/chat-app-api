import { Router } from "express";
import { protectRoute } from "../middlewares";
import { getConnectedUsers, getMessage, sendMessage } from "../controllers/message.controllers";

const router = Router();

router.post("/send/:id", protectRoute, sendMessage);
router.get("/conversations", protectRoute, getConnectedUsers);
router.get("/:id", protectRoute, getMessage)

export default router;