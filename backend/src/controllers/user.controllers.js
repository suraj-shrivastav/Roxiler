import pool from "../config/db.js";

export const getAllStores = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
          s.id AS store_id,
          s.name AS store_name,
          s.address,
          ROUND(AVG(r.rating), 2) AS overall_rating,
          (
            SELECT rating 
            FROM ratings 
            WHERE user_id = ? AND store_id = s.id 
            LIMIT 1
          ) AS user_rating
       FROM stores s
       LEFT JOIN ratings r 
          ON s.id = r.store_id
       GROUP BY s.id`,
      [req.user.id]
    );

    return res.status(200).json({
      success: true,
      message: "All stores retrieved",
      data: rows,
    });
  } catch (error) {
    console.error("Error in getAllStores:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const addRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const { id: store_id } = req.params;
    const user_id = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating)`,
      [user_id, store_id, rating]
    );

    const [[storeRating]] = await pool.query(
      `SELECT 
          ROUND(AVG(r.rating), 2) AS overall_rating,
          (
            SELECT rating 
            FROM ratings 
            WHERE user_id = ? AND store_id = ? 
            LIMIT 1
          ) AS user_rating
       FROM ratings r
       WHERE r.store_id = ?`,
      [user_id, store_id, store_id]
    );

    res.json({
      success: true,
      message: "Rating submitted successfully",
      data: storeRating, // { overall_rating: X, user_rating: Y }
    });
  } catch (error) {
    console.error("Error in addRating:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// get specific store by name or address to be done in frontend... filter
