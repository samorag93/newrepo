const accountModel = require("../models/account-model");
const utilities = require("../utilities/");
const { validationResult} = require('express-validator')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const accountController = {}

// Function to deliver the login view
async function buildLoginView(req, res) {
    try {
        const nav = await utilities.getNav();
        req.flash("notice", "All is required.")
        res.render("account/login", { 
            title: "Login", 
            nav,
        });
        
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
    req.flash("notice", "All is required.")
    res.render("account/register", { 
        title: "Register", 
        nav,
        errors: null
    });
    
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
  
    

    // Hash the password before storing
    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.')
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
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


//week 05

/*************************
 * PROCES LOGIN REQUEST
 * ******************** */

async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}


/**************************
 * ACCOUNT MANAGEMENT VIEW
 * ***********************/
async function buildAccountManagementView(req, res) {
  try {
    if (!req.session.user) {
      req.flash("notice", "No estás autenticado. Por favor, inicia sesión.");
      return res.redirect("/account/login"); // Redirige a la página de inicio de sesión
    }
    let nav = await utilities.getNav();
    const user = req.session.user; // Obtén el usuario de la sesión
    console.log("Account Management View Called");
  // Establece un mensaje flash
    req.flash("notice", `You're logged in ${req.session.user.account_firstname}`);//, ${user.account_firstname}!

  // Renderiza la vista accountController.ejs
    res.render("account/accountController", {
        title: "Account Management",
        nav,
        user // Pasa el usuario a la vista
    });
  } catch (error) {
    console.error("Error loading the view", error)
    // res.status(500).send("There was an error with login")
  }
  
}



module.exports = {buildLoginView, buildRegisterView, regAccount, accountLogin, buildAccountManagementView}