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
router.post("/login", utilities.handleErrors(accountController.processLogin));

// Route to display the registration page
router.get("/register", utilities.handleErrors(accountController.buildRegisterView));

// Route to handle the registration action (POST method)
router.post("/register", regValidate.registrationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.regAccount));
// router.post('/register', utilities.handleErrors(accountController.regAccount))
// router.post('/register', utilities.handleErrors(accountController.regAccount));

// Route to display the account dashboard
router.get("/dashboard", utilities.handleErrors(accountController.buildDashboard));

// Route to handle "My Account" link
// router.get("/my-account", utilities.handleErrors(accountController.buildMyAccount));

// Export the router to be used in the server.js file
module.exports = router;
