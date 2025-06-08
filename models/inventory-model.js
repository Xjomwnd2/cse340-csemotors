const pool = require("../database/");

/* ***************************
 *  Get all classification data
 *  Returns a list of classifications sorted by name
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
    return [];
  }
};

/* ***************************
 *  Get inventory item by ID
 *  Used to display inventory details
 * ************************** */
async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.inv_id = $1`,
      [inv_id]
    );
    return data.rows[0]; // Return just the one item
  } catch (error) {
    console.error("getInventoryById error " + error);
    return null;
  }
};

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
};

/* ***********************************************************
* Delete Inventory Item
* Unit 5, Delete Activity
*********************************************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    throw new Error("Delete Inventory Error");
  }
};

// ✅ Export all functions including the new one
module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById, // 👈 Make sure this is exported!
  checkExistingEmail,
  deleteInventoryItem
};