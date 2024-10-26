// Required for routes
const express = require("express");
const router = new express.Router(); 
const utilities = require("../utilities/"); // Utilities file (index.js)
const accountController = require("../controllers/accountController"); // Account controller
const regValidate = require('../utilities/account-validation');
const { route } = require("./static");

// Route to display the login page
router.get("/login", utilities.handleErrors(accountController.buildLoginView));

// Route to handle the login action (POST method)
// router.post("/login", regValidate.loginRules(), utilities.handleErrors(accountController.accountLogin));
// router.post("/login", utilities.handleErrors(accountController.accountLogin));

router.post("/login", regValidate.checkLoginData, utilities.handleErrors(accountController.accountLogin))
// // Process the login attempt
// router.post(
//     "/login",
//     (req, res) => {
//       res.status(200).send('login process')
//     }
//   )

// Route to display the registration page
router.get("/register", utilities.handleErrors(accountController.buildRegisterView));

// Route to handle the registration action (POST method)
router.post("/register", regValidate.registrationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.regAccount));
// router.post('/register', utilities.handleErrors(accountController.regAccount))
// router.post('/register', utilities.handleErrors(accountController.regAccount));

// Route to display the account management
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));

// Route to logging out
router.get("/logout", (req, res) => {
    res.clearCookie("jwt");
    req.flash("notice", "You have been logged out.")
    res.redirect("/account/login")
})

// Route to UPDATE ACCOUNT view
router.get("/update/:account_id", utilities.handleErrors(accountController.buildUpdateAccountView))


// Export the router to be used in the server.js file
module.exports = router;
