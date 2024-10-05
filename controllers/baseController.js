const utilities = require("../utilities/");
const baseController = {};

baseController.buildHome = async function(req, res){
  console.log("Rendering home page..");
  const nav = await utilities.getNav();
  res.render("index", {title: "Home", nav});
};

module.exports = baseController;

