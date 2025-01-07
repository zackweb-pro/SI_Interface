const oracledb = require("oracledb");

async function getConnection() {
  try {
    if (!oracledb.pool) {
      await oracledb.createPool({
        user: "system", // From .env file
        password: "zakaria", // From .env file
        connectString: "localhost:1521/XE", // From .env file
        poolMin: 5,           // Minimum number of connections in the pool
  poolMax: 20,          // Maximum number of connections in the pool
  poolIncrement: 5,     // Number of connections to add when the pool is exhausted
  queueTimeout: 120000, // Wait up to 120 seconds for a connection
      });
    }
    return await oracledb.getConnection();
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    throw error;
  }
}

module.exports = getConnection;
