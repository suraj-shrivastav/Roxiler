import express from "express";
import {
  addStore,
  addUser,
  dashboard,
} from "../controllers/admin.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/stores", addStore);
router.post("/users", protectRoute(["admin"]), addUser);
router.get("/dashboard", protectRoute(["admin"]), dashboard);

export default router;
