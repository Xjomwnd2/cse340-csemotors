const pool = require("../database/");

/* Insert new comment */
async function addComment(invId, commenterName, commentText) {
  try {
    const sql = `INSERT INTO comments (inv_id, commenter_name, comment_text)
                 VALUES ($1, $2, $3)`;
    await pool.query(sql, [invId, commenterName, commentText]);
    return true;
  } catch (error) {
    throw new Error("Database insert error: " + error.message);
  }
}

/* Get comments for a specific vehicle */
async function getCommentsByInvId(invId) {
  try {
    const sql = `SELECT commenter_name, comment_text, comment_date
                 FROM comments WHERE inv_id = $1 ORDER BY comment_date DESC`;
    const result = await pool.query(sql, [invId]);
    return result.rows;
  } catch (error) {
    throw new Error("Database query error: " + error.message);
  }
}

module.exports = { addComment, getCommentsByInvId };
