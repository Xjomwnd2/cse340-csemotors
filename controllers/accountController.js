const utilities = require("../utilities");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const accountModel = require("../models/account-model");
require("dotenv").config();

// Login handler
const accountLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Step 1: Get account from DB by email
    const accountData = await accountModel.getAccountByEmail(email);
    if (!accountData) {
      // If no account found, return login view with error
      return res.status(400).render("account/login", {
        title: "Login",
        message: "No account found for that email.",
        errors: null,
        email,
      });
    }
    // Step 2: Compare password with hashed password in DB
    const match = await bcrypt.compare(password, accountData.account_password);
    if (!match) {
      // If password doesn't match
      return res.status(401).render("account/login", {
        title: "Login",
        message: "Incorrect password. Please try again.",
        errors: null,
        email,
      });
    }
    // Step 3: Login success — store user in session
    req.session.account = {
      id: accountData.account_id,
      name: `${accountData.account_firstname} ${accountData.account_lastname}`,
      email: accountData.account_email,
      type: accountData.account_type,
    };
    // Step 4: Redirect to account management/dashboard page
    return res.redirect("/account/");
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).render("account/login", {
      title: "Login",
      message: "An error occurred during login. Please try again later.",
      errors: null,
      email,
    });
  }
};
/* ************************* END OF THE HANDLER ************* */
/* ****************************************
 *  Build Register View
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}
/* ****************************************
 *  Build Account Management View
 * *************************************** */
async function buildAccount(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
  });
}
/* ****************************************
 *  Build Login View
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}
/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;
  try {
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    );
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      );
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    req.flash("notice", "Sorry, there was an error processing the registration.");
    res.status(500).render("account/register", {
      title: "Registration", 
      nav,
      errors: null,
    });
  }
}
/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}
/* ****************************************
 *  Process login request
 * *************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  
  try {
    const accountData = await accountModel.getAccountByEmail(account_email);
    
    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
      return;
    }
    
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
      
      const cookieOptions = {
        httpOnly: true,
        maxAge: 3600 * 1000
      };
      
      if (process.env.NODE_ENV !== 'development') {
        cookieOptions.secure = true;
      }
      
      res.cookie("jwt", accessToken, cookieOptions);
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    req.flash("notice", "An error occurred during login. Please try again.");
    res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }
}
// Export the controller functions
module.exports = {
  accountLogin,
  buildAccount,
  buildLogin,
  buildRegister,
  register: registerAccount,
  login: accountLogin,
};
/* ****************************************
*  Deliver accounts view
* *************************************** */
exports.buildRegister = (req, res) => {
  res.render('account/register', {
    title: 'Register',
    errors: null,
    message: null
  });
};
