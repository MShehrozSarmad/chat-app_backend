import express from "express";
const router = express.Router();
import {
	checkAuth,
	signin,
	signout,
	signup,
	updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.put("/update_profile", protectRoute, updateProfile);
router.get("/check-auth", protectRoute, checkAuth);

export default router;
