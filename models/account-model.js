const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      console.error("error registering account", error)
      return error.message
    }
  }

/* ****************************
 *   Check for existing email
 * **************************** */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/******************************************
 * Return account data using email address
 **************************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query('SELECT account_id, account_firstname, account_lastname, account_email, account_password, account_type FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    console.error("Error retrieving account by email:", error)
    return new Error("No matching email found")
  }
}

// async function AccountByEmail(account_email) {
//   try {
//     const result = await pool.query('SELECT * FROM account WHERE account_email = $1', [account_email])
//     return result.rows[0] // Devuelve el usuario (o undefined si no existe)
//   } catch (error) {
//     console.error('Error buscando la cuenta por email', error)
//     throw new Error('Database query failed') // Lanza un error si hay problemas
//   }
// }

/********************
 * Get account by Id
 *******************/

async function getAccountById(accountId) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.account
       WHERE account_id = $1`,
      [accountId]
    );
    return data.rows[0]; // Asegúrate de devolver el primer resultado
  } catch (error) {
    console.error("Error fetching account by ID:", error);
    throw error;
  }
}

module.exports = {registerAccount, checkExistingEmail, getAccountByEmail, getAccountById}