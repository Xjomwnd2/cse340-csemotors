const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController"); // Adjust path as needed
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation');

// Route to build "My Account" view - COMMENTED OUT until you implement buildAccount
// router.get(
//   "/", 
//   utilities.handleErrors(accountController.buildAccount) // <-- Only if this exists!
// );

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