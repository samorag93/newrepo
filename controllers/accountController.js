const accountModel = require("../models/account-model");
const utilities = require("../utilities/");
const { validationResult} = require('express-validator')

const accountController = {}

// Function to deliver the login view
async function buildLoginView(req, res) {
    try {
        const nav = await utilities.getNav();
        
        res.render("account/login", { 
            title: "Login", 
            nav,
        });
        req.flash("notice", "All is required.")
    } catch (error) {
        console.error("Error loading login view:", error);
        res.status(500).send("There was an error loading the login page.");
    }
}



// accountController.buildRegisterView = async function(req, res) {
//     try {
//         const nav = await utilities.getNav();
//         req.flash("notice", "This is a flash message")
//         res.render("account/register", { 
//             title: "Register", 
//             nav,
//             // message: req.flash(),
//             errors: null,
//         });
//         // req.flash("message", "Registration succes")
//     } catch (error) {
//         console.error("Error loading register view:", error);
//         res.status(500).send("There was an error loading the registration page.");
//     }
// }

async function buildRegisterView(req, res, next) {
  try {
    const nav = await utilities.getNav();
    
    res.render("account/register", { 
        title: "Register", 
        nav,
    });
    req.flash("notice", "All is required.")
} catch (error) {
    console.error("Error loading login view:", error);
    res.status(500).send("There was an error loading the register page.");
}
}

// accountController.processRegistration = async function(req, res) {
//     try {
//         // Aquí puedes agregar la lógica de validación de datos y almacenamiento en la base de datos
         
//         req.flash('success', 'Registration successful! You can now log in.')
//         res.redirect('/account/register')
//     } catch (error) {
//         console.error("Error in registration:", error);
//         req.flash('error', 'There was an issue with your registration. Please try again.')
//         res.redirect('/account/register')
//     }
// }


/* ****************************************
*  Process Registration
* *************************************** */
async function regAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
  
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    )
  
    console.log("After registerAccount");
    
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
      })
    }
  }


module.exports = {buildLoginView, buildRegisterView, regAccount}