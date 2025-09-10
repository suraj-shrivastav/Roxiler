import mysql from "mysql2/promise";
import dotenv from "dotenv";
import initDB from "../init.js";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "admin",
  database: process.env.DB_NAME || "rating_system",
  port: 8080,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool
  .getConnection()
  .then((conn) => {
    console.log("Database connected!");
    initDB();
    conn.release();
  })
  .catch((err) => {
    console.error("Database connection failed:   ", err.message);
  });

export default pool;
