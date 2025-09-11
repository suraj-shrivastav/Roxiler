import pool from "../config/db.js";
import bcrypt from "bcrypt";
import { createToken } from "../config/jwt.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    if (!name || !email || !password || !address || !role) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const [existing] = await pool.query("SELECT * FROM users WHERE email=?", [
      email,
    ]);
    if (existing.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashPwd = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, address, role) VALUES (?,?,?,?,?)",
      [name, email, hashPwd, address, role]
    );

    const [rows] = await pool.query("SELECT * FROM users WHERE id=?", [
      result.insertId,
    ]);
    const user = rows[0];

    const token = createToken(user, res);

    console.log("New User created: ", user.name);

    res.json({
      success: true,
      message: "Signup successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup Error ", error);
    res.status(500).json({ success: false, message: "Signup Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = createToken(user, res);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ success: true, message: "Logged Out Successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { email, password, newPassword } = req.body;

    if (!email || !password || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE email=?", [
      email,
    ]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Current password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await pool.query("UPDATE users SET password=? WHERE email=?", [
      hashedNewPassword,
      email,
    ]);

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in updatePassword:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    console.log("Error in the CheckAuth controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
