import pool from "../config/db.js";

export const getStoreRatingsByOwner = async (req, res) => {
  try {
    const ownerId = req.user.id;
    console.log("owner id is: ", ownerId);
    const [rows] = await pool.query(
      `SELECT 
            s.id AS store_id,
            s.name AS store_name,
            u.id AS user_id,
            u.name AS user_name,
            u.email AS user_email,
            r.rating,
            r.created_at,
            avg_table.overall_rating
        FROM stores s
        JOIN ratings r ON r.store_id = s.id
        JOIN users u   ON u.id = r.user_id
        JOIN 
        (
        SELECT store_id, ROUND(AVG(rating), 2) AS overall_rating
        FROM ratings
        GROUP BY store_id
        ) 
        AS avg_table ON avg_table.store_id = s.id
        WHERE s.owner_id = ?
        ORDER BY s.id, r.created_at DESC;
        `,
      [ownerId]
    );

    // const [rows] = await pool.query(`SELECT * FROM stores`);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No ratings found for your stores",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ratings for your stores retrieved",
      data: rows,
    });
  } catch (error) {
    console.error("Error in getStoreRatingsByOwner:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
