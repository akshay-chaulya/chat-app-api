import { Router } from "express";
import { protectRoute } from "../middlewares";
import { getMessages, sendMessage } from "../controllers/message.controllers";

const router = Router();

router.post("/send/:id", protectRoute, sendMessage);
// router.get("/conversations", protectRoute, getConversations);
router.get("/:id", protectRoute, getMessages)

export default router;