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

// Debug: Check what methods are available in accountController
console.log('Available controller methods:', Object.keys(accountController));

// Route to build "My Account" view - COMMENTED OUT until buildAccount is implemented
// router.get(
//   "/",
//   utilities.handleErrors(accountController.buildAccount)
// );

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to deliver the registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to process the registration form submission
if (regValidate) {
  // With validation - check if the method exists first
  const registerMethod = accountController.registerAccount || accountController.register;
  if (registerMethod) {
    router.post(
      "/register",
      regValidate.registrationRules(),
      regValidate.checkRegData,
      utilities.handleErrors(registerMethod)
    );
  } else {
    console.error('No register method found in accountController');
  }
} else {
  // Without validation (fallback)
  const registerMethod = accountController.registerAccount || accountController.register;
  if (registerMethod) {
    router.post(
      "/register",
      utilities.handleErrors(registerMethod)
    );
  } else {
    console.error('No register method found in accountController');
  }
}

// Route to process the login request
if (regValidate) {
  // With validation - check if the method exists first
  const loginMethod = accountController.accountLogin || accountController.login;
  if (loginMethod) {
    router.post(
      "/login",
      regValidate.loginRules(),
      regValidate.checkLoginData,
      utilities.handleErrors(loginMethod)
    );
  } else {
    console.error('No login method found in accountController');
  }
} else {
  // Without validation (fallback)
  const loginMethod = accountController.accountLogin || accountController.login;
  if (loginMethod) {
    router.post(
      "/login",
      utilities.handleErrors(loginMethod)
    );
  } else {
    console.error('No login method found in accountController');
  }
}

// Debug logging (remove in production)
if (process.env.NODE_ENV !== 'production') {
  console.log('regValidate loaded:', !!regValidate);
  if (regValidate) {
    console.log('Available validation methods:', Object.keys(regValidate));
  }
}

module.exports = router;