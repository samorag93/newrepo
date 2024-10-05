const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}




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
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

  module.exports = Util