// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

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
router.get('/add-inventory', invController.buildAddInventoryView)
// Route to add new vehicle POST
router.post('/add-inventory', invController.addVehicle);


module.exports = router;
