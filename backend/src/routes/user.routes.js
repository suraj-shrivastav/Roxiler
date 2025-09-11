import express from "express";
import { addRating, getAllStores } from "../controllers/user.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/stores", protectRoute(["user"]), getAllStores);
router.post("/stores/:id/rating", protectRoute(["user"]), addRating);
router.put("/stores/:id/rating", protectRoute(["user"]), addRating);

export default router;
