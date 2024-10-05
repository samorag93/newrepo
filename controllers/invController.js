const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildVehicleDetail = async function (req, res, next) {
  const vehicleId = req.params.vehicleId; 

  try {
    const vehicleData = await invModel.getVehicleById(vehicleId);

    if (!vehicleData) {
      return res.status(404).render("errors/error", {
        title: "Vehículo no encontrado",
        message: "Lo sentimos, no hemos encontrado el vehículo que buscas."
      });
    }

    // Obtén la navegación
    const nav = await utilities.getNav(); 

    // Renderiza la vista con los detalles del vehículo y la navegación
    res.render("inventory/vehicleDetail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      vehicle: vehicleData,
      nav // Pasa la variable nav a la vista
    });
  } catch (error) {
    next(error); // Llama al middleware de manejo de errores
  }
};


module.exports = invCont