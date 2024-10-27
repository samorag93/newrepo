const express = require("express");
const router = new express.Router();
const favoriteController = require("../controllers/favoriteController");
const utilities = require("../utilities");

// Ruta para añadir un vehículo a favoritos
router.post("/add", utilities.checkLogin, favoriteController.addFavorite);
// route to remove favorite
router.post("/remove", utilities.checkLogin, favoriteController.removeFavorite);
// route to show all favorites
router.get("/list", utilities.checkLogin, favoriteController.showFavorites);
module.exports = router;
