// models/inv-model.js

const pool = require("../database");

/* =======================
   Get all inventory data
========================== */
async function getInventory() {
  try {
    const result = await pool.query("SELECT * FROM public.inventory ORDER BY inv_make");
    return result.rows;
  } catch (error) {
    console.error("getInventory error", error);
    throw error;
  }
}

/* =========================
   Get vehicle by classification ID
============================ */
async function getInventoryByClassificationId(classification_id) {
  try {
    const result = await pool.query(
      "SELECT * FROM public.inventory WHERE classification_id = $1",
      [classification_id]
    );
    return result.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error", error);
    throw error;
  }
}

/* =======================
   Get vehicle by ID
========================== */
async function getVehicleById(inv_id) {
  try {
    const result = await pool.query(
      "SELECT * FROM public.inventory WHERE inv_id = $1",
      [inv_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("getVehicleById error", error);
    throw error;
  }
}

module.exports = {
  getInventory,
  getInventoryByClassificationId,
  getVehicleById,
};
