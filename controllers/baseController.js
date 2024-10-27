const utilities = require("../utilities/");
const baseController = {};

baseController.buildHome = async function(req, res){
  console.log("Rendering home page..");
  const nav = await utilities.getNav();
  const accountData = res.locals.accountData || null
  res.render("index", {
    title: "Home", 
    nav,
    errors: null,
    accountData
  });
};

module.exports = baseController;

