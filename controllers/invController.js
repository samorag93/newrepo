const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  let nav = await utilities.getNav()
  const grid = await utilities.buildClassificationGrid(data)
  // Verifica si hay datos disponibles para la clasificación
  if (!data || data.length === 0) {
    return res.render("inventory/classification", {
      title: "No Vehicles Found",
      nav,
      grid,
      message: "No hay vehículos disponibles en esta clasificación. ¿Quieres añadir uno?",
    })
  }
    
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

// Function to deliver the management view
invCont.builManagementView = async function(req, res){
  try {
    const nav = await utilities.getNav();
    res.render("inventory/management", { 
        title: "Inventory Management",
        nav,
        messages: req.flash()
    });
} catch (error) {
    console.error("Error loading management view:", error);
    res.status(500).send("There was an error loading the inventory management page.");
}
};
//ADD CLASIFICATION VIEW
invCont.buildAddClassificationView = async function (req, res) {
  try {
    const nav = await utilities.getNav();
    res.render("inventory/add-classification", { 
        title: "Inventory Management",
        nav,
        messages: req.flash()
    });
} catch (error) {
    console.error("Error loading management view:", error);
    res.status(500).send("There was an error loading the inventory management page.");
}
};

//ADD NEW CLASSIFICATION

invCont.addClassification = async function (req, res) {
  const classificationName = req.body.classification_name;

  const regex = /^[a-zA-Z0-9]+$/; // Solo letras y números sin espacios
  if (!regex.test(classificationName)) {
      req.flash('error', 'El nombre de la clasificación no debe contener espacios o caracteres especiales.');
      return res.redirect('/inv/classification/add'); // Redirige a la vista de añadir
  }

  try {
      await invModel.addClassification(classificationName); // Inserción en la base de datos
      req.flash('success', 'Clasificación añadida con éxito!'); // Mensaje flash para éxito
      return res.redirect('/inv/management'); // Redirige a la vista de gestión
  } catch (error) {
      req.flash('error', 'Falló al agregar la clasificación.'); // Mensaje flash para error
      return res.redirect('/inv/add-classification'); // Redirige a la vista de añadir
  }
};

// INVENTORY VIEW

invCont.buildAddInventoryView = async function (req, res) {
  try {
    const nav = await utilities.getNav();
    const classificationDropdown = await utilities.getClassificationDropdown();
    res.render("inventory/add-inventory", { 
        title: "Add New Vehicle",
        nav,
        classificationDropdown,
        messages: req.flash()
    });
  } catch (error) {
    req.flash('error', 'Failed to load the Add Inventory page.');
    res.redirect("/inv/management");
  }
};

// ADD NEW VEHICLE

invCont.addVehicle = async function (req, res) {
  const vehicleData = {
      classification_id: req.body.classification_id,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
  };

  try {
      await invModel.addVehicle(vehicleData); // Inserción en la base de datos
      req.flash('success', 'Vehicle added successfully!'); // Mensaje flash para éxito
      return res.redirect('/inv/management'); // Redirige a la vista de gestión
  } catch (error) {
      req.flash('error', 'Failed to add the vehicle.'); // Mensaje flash para error
      return res.redirect('/inv/add-inventory'); // Redirige a la vista de añadir
  }
};

module.exports = invCont