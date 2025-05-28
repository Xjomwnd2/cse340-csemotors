// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const { registrationRules } = require("../utilities/account-validation")


// Route to build "My Account" view
router.get(
  "/", 
  utilities.handleErrors(accountController.buildAccount)
);

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.post('/register', utilities.handleErrors(accountController.registerAccount));

// Export the router
module.exports = router;
