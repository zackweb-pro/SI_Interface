const db = require('../config/db');

async function getAllUsers() {
  const connection = await db();
  const result = await connection.execute(`SELECT * FROM users`);
  await connection.close();
  return result.rows;
}

module.exports = { getAllUsers };
