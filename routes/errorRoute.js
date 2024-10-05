// routes/errorRoute.js
const express = require("express");
const router = new express.Router();
const errorController = require("../controllers/errorController");

// Ruta que desencadena el error 500
router.get("/trigger-error", errorController.triggerError);

module.exports = router;
