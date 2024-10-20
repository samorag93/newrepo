// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validate = require("../utilities/inventory-validation")
const {route} = require("./static")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build vehicle detail view
router.get("/detail/:vehicleId", invController.buildVehicleDetail);
// Route to build vehicle management view
router.get('/management', invController.builManagementView);
// Route to buil add classification view
router.get('/add-classification', invController.buildAddClassificationView)
// Route to add new classification POST
router.post('/add-classification', invController.addClassification)
// Route to buil add New Car
router.get('/add-inventory',  invController.buildAddInventoryView)
// Route to add new vehicle POST
router.post('/add-inventory', validate.inventoryUpdateRules(), validate.checkAddVehicleData, utilities.handleErrors(invController.addVehicle));
// Route to get vehicled by classification
// router.get('/getInventory/:classificationId', utilities.handleErrors(invController.getInventoryJSON))
router.get("/getInventory/:classificationId", invController.getInventoryJson);
//route to MODIFY view
router.get('/edit/:inv_id', utilities.handleErrors(invController.editInventoryView)); 
//route to UPDATE the modify view
// router.post("/update", validate.inventoryUpdateRules(), utilities.handleErrors(invController.updateInventory))
router.post("/update", validate.inventoryUpdateRules(), validate.checkUpdateData, utilities.handleErrors(invController.updateInventory))
module.exports = router;
