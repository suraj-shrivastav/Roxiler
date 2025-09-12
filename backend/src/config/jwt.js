// config/jwt.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const createToken = (user, res) => {
  const token = jwt.sign({ id: user.id }, "jwt_secret_key", {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
