// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation'); // Adjust path if needed

// Route to build "My Account" view (make sure buildAccount exists in your controller)
// If you don't have it yet, comment this out or implement it!
router.get(
  "/", 
  utilities.handleErrors(accountController.buildAccount) // <-- Only if this exists!
);

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to deliver the registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to process the registration form submission
router.post('/register', utilities.handleErrors(accountController.register));

// Process the login request with validation middleware
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.login)
);

module.exports = router;
