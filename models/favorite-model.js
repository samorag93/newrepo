const pool = require("../database");

/**********************
 * ADD CAR TO FAVORITES
 *********************/
async function addFavorite(account_id, inv_id) {
    try {
        const sql = `INSERT INTO favorites (account_id, inv_id) VALUES ($1, $2) RETURNING *`;
        const result = await pool.query(sql, [account_id, inv_id]);
        return result.rows[0];
    } catch (error) {
        console.error("Error adding vehicle to favorites: ", error);
        throw error;
    }
}

/**********************
 * CHECK IF CAR IS FAVORITE
 *********************/
async function isFavorite(account_id, inv_id) {
    try {
        const sql = `SELECT * FROM favorites WHERE account_id = $1 AND inv_id = $2`;
        const result = await pool.query(sql, [account_id, inv_id]);
        return result.rows.length > 0; // Devuelve true si el vehículo está en favoritos, de lo contrario false
    } catch (error) {
        console.error("Error checking if vehicle is favorite: ", error);
        throw error;
    }
}

/**********************
 * REMOVE CAR FROM FAVORITES
 *********************/
async function removeFavorite(account_id, inv_id) {
    try {
        const sql = `DELETE FROM favorites WHERE account_id = $1 AND inv_id = $2 RETURNING *`;
        const result = await pool.query(sql, [account_id, inv_id]);
        return result.rows[0];
    } catch (error) {
        console.error("Error removing vehicle from favorites: ", error);
        throw error;
    }
}

/***********************
 * GET ALL FAVORITES
 **********************/
async function getFavoritesByAccountId(account_id) {
    try {
        const sql = `SELECT * FROM favorites WHERE account_id = $1`;
        const result = await pool.query(sql, [account_id]);
        console.log("Database result: ", result.rows); // Esto mostrará los resultados de la consulta
        return result.rows; // Retorna un array de favoritos
    } catch (error) {
        console.error("Error retrieving favorites from database: ", error);
        throw error; // Lanza el error para manejarlo en el controlador
    }
}

module.exports = { addFavorite, isFavorite, removeFavorite, getFavoritesByAccountId };
