import { Router } from "express";
import { protectRoute } from "../middlewares";
import { searchUsers, getAllUsers } from "../controllers/users.controllers";

const router = Router();

router.get("/search", protectRoute, searchUsers);
// router.post("/send-request/:id", protectRoute, createConversation)
// router.post("/verify-request/:id", protectRoute, verifyConversation)
router.get("/all-users", protectRoute, getAllUsers)

export default router;