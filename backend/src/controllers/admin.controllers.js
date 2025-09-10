import pool from "../config/db.js";
import bcrypt from "bcrypt";
import {
  getBasicUserList,
  getDetailedUserList,
  getStoreList,
  getTotalRatings,
  getTotalStores,
  getTotalUsers,
} from "../models/admin.model.js";
export const addStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    if (!name || !email || !address || !owner_id) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields Required" });
    }

    const [ownerRows] = await pool.query("SELECT id FROM users WHERE id=?", [
      owner_id,
    ]);
    if (ownerRows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Owner not found" });
    }

    const [existing] = await pool.query("SELECT * FROM stores WHERE email=?", [
      email,
    ]);
    if (existing.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email Already Used" });
    }

    const [rows] = await pool.query(
      `INSERT INTO stores (name, email, address, owner_id) VALUES(?,?,?,?)`,
      [name, email, address, owner_id]
    );

    return res.status(201).json({
      success: true,
      message: "Store created successfully",
      storeId: rows.insertId,
    });
  } catch (error) {
    console.error("Error in adding store:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

// role=['user', 'admin'];
export const addUser = async (req, res) => {
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

    res.json({
      success: true,
      message: "User Created Successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Add User Error ", error);
    res.status(500).json({ success: false, message: "Add User Error" });
  }
};

export const dashboard = async (req, res) => {
  try {
    const total_users = await getTotalUsers();
    const total_stores = await getTotalStores();
    const total_ratings = await getTotalRatings();
    const store_list = await getStoreList();
    const user_list = await getBasicUserList();
    const detailed_user_list = await getDetailedUserList();

    res.json({
      stats: {
        total_users,
        total_stores,
        total_ratings,
      },
      store_list,
      user_list,
      detailed_user_list,
    });
  } catch (error) {
    console.error("Error in dashboard ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
