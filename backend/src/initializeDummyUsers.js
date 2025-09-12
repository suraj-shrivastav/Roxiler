import pool from "./config/db.js";
import bcrypt from "bcrypt";

export const initializeDummyUsers = async () => {
  try {
    const users = [
      {
        name: "Dummy User",
        email: "roxiler_user@gmail.com",
        password: "Roxiler@123",
        address: "User Address",
        role: "user",
      },
      {
        name: "Dummy Store Owner",
        email: "roxiler_store@gmail.com",
        password: "Roxiler@123",
        address: "Store Owner Address",
        role: "store_owner",
      },
      {
        name: "Dummy Admin",
        email: "roxiler_admin@gmail.com",
        password: "Roxiler@123",
        address: "Admin Address",
        role: "admin",
      },
    ];

    for (const user of users) {
      const { name, email, password, address, role } = user;

      const [existing] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
      if (existing.length > 0) {
        console.log(`User with email ${email} already exists.`);
        continue;
      }

      const hashPwd = await bcrypt.hash(password, 10);

      await pool.query(
        "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
        [name, email, hashPwd, address, role]
      );

      console.log(`Dummy user with role '${role}' created successfully.`);
    }
  } catch (error) {
    console.error("Error initializing dummy users:", error.message);
  }
};
