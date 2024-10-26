const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
// const 
require("dotenv").config()

const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a class="links" href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list += '<a class="links" href="/inv/type/' + row.classification_id + '" title="See our inventory of ' + row.classification_name + ' vehicles">' + row.classification_name + "</a>"
    // list += '<a href="'
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/*let data = await invModel.getClassifications()
  data.rows.forEach((row) => {
    }*/


/* **************************************
* Build the classification view HTML
* ************************************ */
// Util.buildClassificationGrid = async function(data){
//     let grid
//     if(data.length > 0){
//       grid = '<ul id="inv-display">'
//       data.forEach(vehicle => { 
//         grid += '<li>'
//         grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
//         + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
//         + 'details"><img src="' + vehicle.inv_thumbnail 
//         +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
//         +' on CSE Motors" /></a>'
//         grid += '<div class="namePrice">'
        
//         grid += '<h2>'
//         grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
//         + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
//         + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
//         grid += '</h2>'
//         grid += '<span>$' 
//         + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
//         grid += '<hr />'
//         grid += '</div>'
//         grid += '</li>'
//       })
//       grid += '</ul>'
//     } else { 
//       grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
//     }
//     return grid
//   }

Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<div class="card-container">' // Contenedor de las tarjetas
    data.forEach(vehicle => { 
      grid += '<div class="card">' // Inicio de la tarjeta
      grid += '<div class="card-image">'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + ' details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '</div>'
      grid += '<div class="card-content">' // Contenido de la tarjeta
      grid += '<hr>'
      grid += '<h2 class="card-title">'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<p class="card-price">$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>'
      grid += '</div>'
      grid += '</div>' // Fin de la tarjeta
    })
    grid += '</div>' // Fin del contenedor de las tarjetas
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
*  Deliver login view
* *************************************** */
// async function buildLogin(req, res, next) {
//   let nav = await utilities.getNav()
//   res.render("account/login", {
//     title: "Login",
//     nav,
//   })
// }

// module.exports = { buildLogin }


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
 * MENU DESPLEGABLE
 * *************************************  */

Util.getClassificationDropdown = async function (selectedId = null) {
  const data = await invModel.getClassifications();
  let dropdown = `<select name="classification_id" id="classification" required>`;
  dropdown += `<option value="">Choose a Classification</option>`;
  data.rows.forEach((row) => {
    dropdown += `<option value="${row.classification_id}"`;
    if (selectedId && row.classification_id == selectedId) {
      dropdown += " selected";
    }
    dropdown += `>${row.classification_name}</option>`;
  });
  dropdown += `</select>`;
  return dropdown;
};

// week 05

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

/*******************
 * Check Login
 ******************/

Util.checkLogin = (req, res, next) => {
  if(res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in")
    return res.redirect("/account/login")
  }
}

/********************
 * Chek Account Type
 ********************/

// Util.checkAccountType = async (req, res, next) => {
//   try {
//     // Verificar si existe un token JWT
//     const token = req.cookies.jwt;
//     if (!token) {
//       req.flash("notice", "Please log in to access this page.");
//       return res.redirect("/account/login");
//     }

//     // Verificar el token
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
//       if (err) {
//         req.flash("notice", "Invalid session, please log in again.");
//         return res.redirect("/account/login");
//       }

//       // Obtener el account_id desde el token
//       const accountId = decodedToken.account_id;

//       // Obtener el tipo de cuenta desde la base de datos
//       const accountType = await invModel.getAccountTypeById(accountId);

//       if (accountType === "Employee" || accountType === "Admin") {
//         // Si el tipo de cuenta es "Empleado" o "Administrador", permitir el acceso
//         next();
//       } else {
//         // Si el tipo de cuenta no es adecuado, redirigir a la página de login
//         req.flash("notice", "You do not have permission to access this area.");
//         return res.redirect("/account/login");
//       }
//     });
//   } catch (error) {
//     console.error("Error checking account type:", error);
//     req.flash("notice", "An error occurred, please log in again.");
//     return res.redirect("/account/login");
//   }
// };
Util.checkAccountType = (req, res, next) => {
  const accountData = res.locals.accountData
  if (accountData && (accountData.account_type === 'Admin' || accountData.account_type === 'Employee')) {
    next()
  } else {
    req.flash("notice", "You do not have permission to access this page.")
    res.redirect("/account/login")
  }
}
module.exports = Util