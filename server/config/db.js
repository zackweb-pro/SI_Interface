const oracledb = require('oracledb');

async function connectToDatabase() {
  try {
    const connection = await oracledb.getConnection({
      user: process.env.DB_USER, // From .env file
      password: process.env.DB_PASSWORD, // From .env file
      connectString: process.env.DB_HOST, // From .env file
    });
    console.log('Connected to Oracle Database!');
    return connection;
  } catch (err) {
    console.error('Database connection error:', err.message || err);
    throw err;
  }
}

module.exports = connectToDatabase;
