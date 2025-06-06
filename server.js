/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities/");
const session = require("express-session");
const pool = require('./database/');
const accountRoute = require("./routes/accountRoute");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

/* ***********************
 * Middleware to inject nav into all renders
 *************************/
app.use(async (req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav();  // This sets nav globally for all views
    next();
  } catch (err) {
    next(err);
  }
});

============================================================================
// TASK 2: Authorization Middleware (middleware/auth.js)
// ============================================================================

const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const utilities = require('../utilities');

// Check if user is logged in
const checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            (err, accountData) => {
                if (err) {
                    req.flash("Please log in");
                    res.clearCookie("jwt");
                    return res.redirect("/account/login");
                }
                res.locals.accountData = accountData;
                res.locals.loggedin = 1;
                next();
            }
        );
    } else {
        next();
    }
};

// Check account type for inventory access
const checkAccountType = (req, res, next) => {
    if (res.locals.loggedin) {
        const accountType = res.locals.accountData.account_type;
        if (accountType == "Employee" || accountType == "Admin") {
            next();
        } else {
            req.flash("notice", "Please log in with appropriate credentials.");
            return res.redirect("/account/login");
        }
    } else {
        req.flash("notice", "Please log in.");
        return res.redirect("/account/login");
    }
};

module.exports = { checkJWTToken, checkAccountType };

/* ***********************
 * Other Middleware
 *************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET || 'fallbackSecret123',
  resave: false,
  saveUninitialized: false,
  name: 'sessionId',
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 2
  }
}));

app.use(cookieParser());

app.use(require('connect-flash')());
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* ***********************
 * View Engine and Layouts
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Routes
 *************************/
// Public route
app.use(express.static("public"));

//Index route
app.get("/", baseController.buildHome);

// Inventory routes
app.use("/inv", inventoryRoute);

// Home route — no need to pass nav explicitly now
app.get("/", utilities.handleErrors(baseController.buildHome));

// Account routes
app.use("/account", accountRoute);

// 404 route must be last
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'});
});

/* ***********************
 * Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  res.status(err.status || 500).render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav: res.locals.nav // just to be safe, but already set globally
  });
});

/* ***********************
 * Server listen
 *************************/
const port = process.env.PORT || 5501;
const host = process.env.HOST || 'localhost';

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
