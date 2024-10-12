const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

module.exports = {getClassifications}


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get vehicle details by ID
 * ************************** */
async function getVehicleById(vehicleId) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory 
      WHERE inv_id = $1`,
      [vehicleId]
    );
    return data.rows[0]; // Devuelve el primer resultado
  } catch (error) {
    console.error("getVehicleById error: " + error);
    throw error; // Lanza el error para manejarlo en el controlador
  }
}

/* ***************************
 *  Add a new classification
 * ************************** */
// async function addClassification(classificationName) {
//   try {
//     await pool.query(
//       "INSERT INTO public.classification (classification_name) VALUES ($1)",
//       [classificationName]
//     );
//   } catch (error) {
//     console.error("addClassification error: " + error);
//     throw error; // Lanza el error para manejarlo en el controlador
//   }
// }

async function addClassification(classificationName) {
  const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
  try {
      const result = await pool.query(sql, [classificationName]);
      return result.rows[0];
  } catch (error) {
      console.error("Error al agregar la clasificación", error);
      throw error;
  }
}

/* ***************************
 *  Add a new VEHICLE
 * ************************** */

async function addVehicle(vehicleData) {
  const sql = `INSERT INTO inventory 
               (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;

  const values = [
      vehicleData.inv_make,
      vehicleData.inv_model,
      vehicleData.inv_year,
      vehicleData.inv_description,
      vehicleData.inv_image,
      vehicleData.inv_thumbnail,
      vehicleData.inv_price,
      vehicleData.inv_miles,
      vehicleData.inv_color,
      vehicleData.classification_id
  ];

  try {
      const result = await pool.query(sql, values);
      return result.rows[0]; // Retorna el vehículo agregado
  } catch (error) {
      console.error("Error adding vehicle", error);
      throw error;
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addVehicle};