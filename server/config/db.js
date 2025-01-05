const oracledb = require('oracledb');

async function connectToDatabase() {
  try {
    const connection = await oracledb.getConnection({
      user: "system", // From .env file
      password: "zakaria", // From .env file
      connectString: "localhost:1521/XE", // From .env file
    });
    console.log('Connected to Oracle Database!');
    return connection;
  } catch (err) {
    console.error('Database connection error:', err.message || err);
    throw err;
  }
}

module.exports = connectToDatabase;
