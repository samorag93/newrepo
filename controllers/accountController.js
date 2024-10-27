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
      // res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      return res.redirect("/")
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

async function buildAccountManagement(req, res, next) {
  try {
    // Obtener el menú de navegación
    let nav = await utilities.getNav()

    const accountData = res.locals.accountData
    // Renderizar la vista de administración de cuenta
    res.render("account/accountManagement", {
      title: "Account Management",
      nav, // Menú de navegación
      errors: null, // No hay errores en este caso
      accountData,
    })
  } catch (error) {
    next(error) // Manejo de errores
  }
}

/*********************
 * update account view
 ********************/

async function buildUpdateAccountView(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  let nav = await utilities.getNav()
  const itemData = await accountModel.getAccountById(account_id)
  const itemName = `${itemData.account_firstname}`
  res.render("account/update", {
    title: "Edit your account " + itemName,
    nav,
    errors: null,
    account_id: itemData.account_id,
    account_firstname: itemData.account_firstname,
    account_lastname: itemData.account_lastname,
    account_email: itemData.account_email,
    // account_password: itemData.account_password,
    account_type: itemData.account_type
  })
}



module.exports = {buildLoginView, buildRegisterView, regAccount, accountLogin, buildAccountManagement, buildUpdateAccountView}