// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");

// Route to build "My Account" view
router.get(
  "/", 
  utilities.handleErrors(accountController.buildAccount)
);

// Export the router
module.exports = router;
