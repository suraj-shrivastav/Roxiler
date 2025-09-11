import pool from "../config/db.js";

// Dashboard for admin
export const getTotalUsers = async () => {
  const [rows] = await pool.query("SELECT COUNT(*) AS count FROM users");
  return rows[0].count;
};

export const getTotalStores = async () => {
  const [rows] = await pool.query("SELECT COUNT(*) AS count FROM stores");
  return rows[0].count;
};

export const getTotalRatings = async () => {
  const [rows] = await pool.query("SELECT COUNT(*) AS count FROM ratings");
  return rows[0].count;
};

export const getStoreList = async () => {
  const [rows] = await pool.query("SELECT * FROM stores");
  return rows;
};

export const getBasicUserList = async () => {
  const [rows] = await pool.query(
    "SELECT name, email, address, role FROM users WHERE role IN (?, ?)",
    ["user", "admin"]
  );
  return rows;
};

export const getDetailedUserList = async () => {
  const [rows] = await pool.query(`
    SELECT 
      u.name,
      u.email,
      u.address,
      u.role,
      CASE 
        WHEN u.role = 'store_owner' THEN ROUND(AVG(r.rating), 2)
        ELSE NULL
      END AS rating
    FROM users AS u
    LEFT JOIN stores AS s ON u.id = s.owner_id
    LEFT JOIN ratings AS r ON s.id = r.store_id
    GROUP BY u.id
  `);
  return rows;
};
