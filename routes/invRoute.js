// routes/invRoute.js
const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");

// Route to render the management view
router.get("/", invController.buildManagementView);

// 👇 Add this route to handle vehicle detail view by inv_id
router.get("/detail/:inv_id", invController.buildByInventoryId);

module.exports = router;
