import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const protectRoute = async (req, res, next) => {
  try {
    console.log("Protect Route Middleware Accessed");
    const token = req.cookies?.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
    console.log(rows[0]);
    next();
  } catch (error) {
    console.error("Error in protectRoute Middleware:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
