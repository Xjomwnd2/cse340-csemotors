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

// Route to build "My Account" view
// Uncomment and implement this later
// router.get("/", utilities.handleErrors(accountController.buildAccount));

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to deliver the registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Handle POST routes based on validation availability
if (regValidate) {
  // Process the registration data
  router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  );

  // Process the login request
  router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
  );
} else {
  // If validation is missing, fallback to minimal handlers
  router.post(
    "/register",
    utilities.handleErrors(accountController.registerAccount)
  );

  router.post(
    "/login",
    utilities.handleErrors(accountController.accountLogin)
  );
}

module.exports = router;
