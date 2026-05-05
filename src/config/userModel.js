const pool = require("./db");
async function getAllUsers() {
  const queryText = "SELECT * FROM users";
  const result = await pool.query(queryText);
  return result.rows;
}

async function getOneUserById(id) {
  const queryText = "SELECT * FROM users where id= $1";
  const values = [id];
  const result = await pool.query(queryText, values);
  return result.rows[0];
}

async function deleteUser(id) {
  let queryText = "DELETE FROM users WHERE id =$1; ";
  const values = [id];
  const result = await pool.query(queryText, values);
  return result.rowCount;
}

async function addUser(name, email, password) {
  let queryText =
    "INSERT INTO users ( name, email, password) VALUES ($1, $2, $3) RETURNING *";
  let values = [name, email, password];
  const result = await pool.query(queryText, values);
  return result.rows[0];
}

async function getUserById(googleId) {
  const queryText = "SELECT * FROM users where googleid= $1";
  const values = [googleId];
  const result = await pool.query(queryText, values);
  return result.rows[0];
}

async function createNewUser([
  googleId,
  displayName,
  firstName,
  lastName,
  email,
]) {
  let queryText =
    "INSERT INTO users ( googleId, displayName, firstName, lastName, email) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  let values = [googleId, displayName, firstName, lastName, email];
  const result = await pool.query(queryText, values);
  return result.rows[0];
}

module.exports = {
  getAllUsers,
  getOneUserById,
  deleteUser,
  addUser,
  getUserById,
  createNewUser,
};
