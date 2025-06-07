// routes/accountRoute.js

// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");

// Only require validation if the file exists
let regValidate;
try {
  regValidate = require('../utilities/account-validation');
} catch (error) {
  console.log("Validation middleware not found - proceeding without validation");
  regValidate = null;
}

// Route to build "My Account" view - COMMENTED OUT until you implement buildAccount
// router.get(
//   "/",
//   utilities.handleErrors(accountController.buildAccount)
// );

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to deliver the registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to process the registration form submission
router.post('/register', utilities.handleErrors(accountController.register));

// Process the login request (with validation if available)
if (regValidate) {
  router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
  );
} else {
  // Fallback login route without validation
  router.post(
    "/login",
    utilities.handleErrors(accountController.accountLogin)
  );
}

module.exports = router;