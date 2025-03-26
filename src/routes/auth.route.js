import express from "express";
const router = express.Router();
import { signin, signout, signup, testAuth, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.put("/update_profile", protectRoute, updateProfile)
router.get("/test", protectRoute, testAuth)

export default router;