import express from "express";
import { getStoreRatingsByOwner } from "../controllers/owner.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/dashboard", protectRoute(["store_owner"]), getStoreRatingsByOwner);

export default router;
