// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

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

// Display the registration form
router.get('/register', accountController.buildRegister);

// Route to process the registration form submission
router.post('/register', utilities.handleErrors(accountController.register));

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

module.exports = router;