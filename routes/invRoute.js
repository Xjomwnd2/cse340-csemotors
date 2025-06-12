// routes/invRoute.js
const express = require('express');
const router = express.Router();
const invController = require('../controllers/invController');

// Route to render the management view
router.get('/', invController.buildManagementView);

module.exports = router;
