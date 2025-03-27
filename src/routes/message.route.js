import express from "express";
import {
	getMessages,
	getSidebarUsers,
	sendMessage,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";

const router = express.Router();

router.get("/users", protectRoute, getSidebarUsers);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
export default router;
