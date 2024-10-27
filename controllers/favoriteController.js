const favoriteModel = require("../models/favorite-model");
const utilities = require("../utilities/")

/**
 * Handle adding a vehicle to favorites
 */
// async function addFavorite(req, res) {
//     try {
//         const account_id = res.locals.accountData.account_id; // Obtener ID del usuario
//         const inv_id = req.body.inv_id; // Obtener ID del vehículo desde el formulario

//         await favoriteModel.addFavorite(account_id, inv_id); // Añadir a favoritos

//         req.flash("notice", "Vehicle added to favorites successfully.");
//         res.redirect(`/inventory/detail/${inv_id}`);
//     } catch (error) {
//         console.error("Error adding vehicle to favorites: ", error);
//         req.flash("error", "Could not add vehicle to favorites.");
//         res.redirect(`/inventory/detail/${req.body.inv_id}`);
//     }
// }

async function addFavorite(req, res) {
    try {
        // Verificar si el usuario está autenticado
        if (!res.locals.accountData) {
            req.flash("error", "You must be logged in to add favorites.");
            return res.redirect("/account/login"); // Redirigir al inicio de sesión si no está autenticado
        }

        const account_id = res.locals.accountData.account_id; // Obtener ID del usuario
        const inv_id = req.body.inv_id; // Obtener ID del vehículo desde el formulario

        // Validar que el inv_id es válido
        if (!inv_id) {
            req.flash("error", "Invalid vehicle ID.");
            return res.redirect("/inventory"); // O redirigir a una página adecuada
        }

        await favoriteModel.addFavorite(account_id, inv_id); // Añadir a favoritos

        req.flash("notice", "Vehicle added to favorites successfully.");
        res.redirect(`/inv/detail/${inv_id}`);
    } catch (error) {
        console.error("Error adding vehicle to favorites: ", error);
        req.flash("error", "Could not add vehicle to favorites.");
        res.redirect(`/inv/detail/${req.body.inv_id}`); // Redirigir a la página de detalles del vehículo
    }
}

async function removeFavorite(req, res) {
    try {
        // Verificar si el usuario está autenticado
        if (!res.locals.accountData) {
            req.flash("error", "You must be logged in to remove favorites.");
            return res.redirect("/account/login"); // Redirigir al inicio de sesión si no está autenticado
        }

        const account_id = res.locals.accountData.account_id; // Obtener ID del usuario
        const inv_id = req.body.inv_id; // Obtener ID del vehículo desde el formulario

        // Validar que el inv_id es válido
        if (!inv_id) {
            req.flash("error", "Invalid vehicle ID.");
            return res.redirect("/inventory"); // O redirigir a una página adecuada
        }

        await favoriteModel.removeFavorite(account_id, inv_id); // Eliminar de favoritos

        req.flash("notice", "Vehicle removed from favorites successfully.");
        res.redirect(`/inv/detail/${inv_id}`); // Redirigir a la página de detalles del vehículo
    } catch (error) {
        console.error("Error removing vehicle from favorites: ", error);
        req.flash("error", "Could not remove vehicle from favorites.");
        res.redirect(`/inv/detail/${inv_id}`); // Redirigir a la página de detalles del vehículo
    }
}

async function showFavorites(req, res) {
    try {
        const nav = await utilities.getNav();
        const account_id = res.locals.accountData.account_id; // Obtener ID del usuario

        // Obtener los vehículos favoritos del modelo
        const favorites = await favoriteModel.getFavoritesByAccountId(account_id);
        console.log("favorites retrieved: ", favorites)
        // Verifica si no hay favoritos
        if (!favorites || favorites.length === 0) {
            req.flash("notice", "You have no favorite vehicles yet.");
            return res.render("favorites/list", {
                title: "Your Favorite Vehicles",
                favorites: [], // Pasar un array vacío si no hay favoritos
                nav
            });
        }

        // Renderizar la vista de favoritos con los datos de los vehículos
        res.render("favorites/list", {
            title: "Your Favorite Vehicles",
            favorites,
            nav
        });
    } catch (error) {
        console.error("Error retrieving favorites: ", error);
        req.flash("error", "Could not retrieve your favorites. Please try again later.");
        const nav = await utilities.getNav(); 
        return res.render("favorites/list", {
            title: "Your Favorite Vehicles",
            favorites: [], // Pasar un array vacío en caso de error
            error: "Could not retrieve your favorites. Please try again later.",
            nav
        });
    }
}

module.exports = { addFavorite, removeFavorite, showFavorites }
