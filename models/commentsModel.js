const pool = require("../database/")

/* ***************************
 *  Get all comments for a specific vehicle
 * ************************** */
async function getCommentsByInventoryId(inv_id) {
  try {
    const sql = `
      SELECT comment_id, inv_id, comment_name, comment_text, comment_date 
      FROM comments 
      WHERE inv_id = $1 
      ORDER BY comment_date DESC
    `
    const data = await pool.query(sql, [inv_id])
    return data.rows
  } catch (error) {
    console.error("getCommentsByInventoryId error " + error)
    throw error
  }
}

/* ***************************
 *  Add a new comment
 * ************************** */
async function addComment(inv_id, comment_name, comment_text) {
  try {
    const sql = `
      INSERT INTO comments (inv_id, comment_name, comment_text) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `
    const data = await pool.query(sql, [inv_id, comment_name, comment_text])
    return data.rows[0]
  } catch (error) {
    console.error("addComment error " + error)
    throw error
  }
}

/* ***************************
 *  Delete a comment (optional for admin features)
 * ************************** */
async function deleteComment(comment_id) {
  try {
    const sql = "DELETE FROM comments WHERE comment_id = $1"
    const data = await pool.query(sql, [comment_id])
    return data.rowCount > 0
  } catch (error) {
    console.error("deleteComment error " + error)
    throw error
  }
}

module.exports = {
  getCommentsByInventoryId,
  addComment,
  deleteComment
}