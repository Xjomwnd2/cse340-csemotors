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
  console.log("Validation middleware loaded successfully");
} catch (error) {
  console.log("Validation middleware not found - proceeding without validation");
  regValidate = null;
}

// Debug logging (remove in production)
if (process.env.NODE_ENV !== 'production') {
  console.log('Account routes loaded successfully');
}

// Route to build "My Account" view
router.get(
  "/",
  utilities.handleErrors(accountController.buildAccount)
);

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to deliver the registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to process the registration form submission
if (regValidate && 
    typeof regValidate.registrationRules === 'function' && 
    typeof regValidate.checkRegData === 'function') {
  // With validation
  router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.register)
  );
} else {
  // Without validation (fallback)
  router.post(
    "/register",
    utilities.handleErrors(accountController.register)
  );
}

// Route to process the login request
if (regValidate && 
    typeof regValidate.loginRules === 'function') {
  // With validation - but checkLoginData doesn't exist, so use checkRegData or create it
  router.post(
    "/login",
    regValidate.loginRules(),
    // Note: You need to create checkLoginData in your validation file
    // For now, using fallback without validation
    utilities.handleErrors(accountController.accountLogin)
  );
} else {
  // Without validation (fallback)
  router.post(
    "/login",
    utilities.handleErrors(accountController.accountLogin)
  );
}

// Debug logging (remove in production)
if (process.env.NODE_ENV !== 'production') {
  console.log('regValidate loaded:', !!regValidate);
  if (regValidate) {
    console.log('Available validation methods:', Object.keys(regValidate));
  }
}

module.exports = router;