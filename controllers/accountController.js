// controllers/accountController.js

const utilities = require("../utilities")  // Adjust path as needed


const accountController = {
  login: (req, res) => {
    res.send("Login handler not implemented yet.");
  },
  register: (req, res) => {
    res.send("Register handler not implemented yet.");
  }
};

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

module.exports = accountController;