const utilities = require(".")
const invModel = require("../models/inventory-model")
const {body, validationResult} = require("express-validator")
const validate = {}

validate.inventoryUpdateRules = () => {
    return [
        // Validate classification_id
        body("classification_id")
            .trim()
            .notEmpty()
            .isInt()
            .withMessage("Please select a classification."),

        // Validate inv_make (vehicle make)
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a make."),

        // Validate inv_model (vehicle model)
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a model."),

        // Validate inv_year (vehicle year)
        body("inv_year")
            .trim()
            .notEmpty()
            .isInt({ min: 1886, max: new Date().getFullYear() + 1 }) // Valid from 1886 to current year + 1
            .withMessage("Please provide a valid year."),

        // Validate inv_description (vehicle description)
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 10 }) // Description must have at least 10 characters
            .withMessage("Please provide a description with at least 10 characters."),

        // Validate inv_image (image URL)
        body("inv_image")
            .trim()
            .notEmpty()
            .isURL()
            .withMessage("Please provide a valid image URL."),

        // Validate inv_thumbnail (thumbnail URL)
        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .isURL()
            .withMessage("Please provide a valid thumbnail URL."),

        // Validate inv_price (vehicle price)
        body("inv_price")
            .trim()
            .notEmpty()
            .isFloat({ min: 0 })
            .withMessage("Please provide a valid price."),

        // Validate inv_miles (vehicle mileage)
        body("inv_miles")
            .trim()
            .notEmpty()
            .isInt({ min: 0 })
            .withMessage("Please provide valid mileage."),

        // Validate inv_color (vehicle color)
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a color."),
    ]
}

//add vehicle validate
validate.checkAddVehicleData = async(req, res, next) => {
    const {classification_id, inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const classificationDropdown = await utilities.getClassificationDropdown(classification_id); // Añadido
        res.render("inventory/add-inventory", {
            errors,
            title: "Inventory Management",
            nav,
            classificationDropdown,
            classification_id,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color            
        })
        return
    }
    next()
}

validate.checkUpdateData = async(req, res, next) => {
    const {classification_id, inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const classificationDropdown = await utilities.getClassificationDropdown(classification_id); // Añadido
        res.render("inventory/management", {
            errors,
            title: "Vehicle Management",
            nav,
            classificationDropdown,
            classification_id,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color            
        })
        return
    }
    next()
}

module.exports = validate