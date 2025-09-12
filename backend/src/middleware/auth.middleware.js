import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../config/db.js";

dotenv.config();

export const protectRoute = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      console.log("Protect Route Middleware Accessed");
      const token = req.cookies?.jwt;
      console.log("Token is: ", token);

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized - No Token Provided",
        });
      }

      const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret_key";

      const decoded = jwt.verify(token, JWT_SECRET);

      if (!decoded) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized - Invalid Token" });
      }

      const [rows] = await pool.query(
        "SELECT id, name, email, address, role FROM users WHERE id=?",
        [decoded.id]
      );

      if (rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      req.user = rows[0];
      if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden - You do not have access to this resource",
        });
      }
      console.log(rows[0].role, " Pass -> next");
      next();
    } catch (error) {
      console.error("Error in protectRoute Middleware:", error.message);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  };
};
