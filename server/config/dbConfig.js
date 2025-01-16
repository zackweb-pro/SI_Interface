const oracledb = require("oracledb");

const dbConfig = {
  user: "ADMIN",
  password: "Dohanegraoui5",
  connectString: `(description=(retry_count=20)(retry_delay=3)
    (address=(protocol=tcps)(port=1522)(host=adb.af-johannesburg-1.oraclecloud.com))
    (connect_data=(service_name=g1d600ca2a4366d_js2q4423a4hx78w2_high.adb.oraclecloud.com))
    (security=(ssl_server_dn_match=yes)))`,
};

async function getConnection() {
  try {
    // Check if the pool with alias "default" exists
    let pool;
    try {
      pool = await oracledb.getPool("default"); // Get existing pool if it exists
      console.log("Using existing connection pool.");
    } catch (error) {
      if (error.message.includes("NJS-047")) {
        // If the pool does not exist, create a new one
        console.log("Creating a new connection pool.");
        pool = await oracledb.createPool({
          ...dbConfig,
          poolMax: 20, // Maximum number of connections in the pool
          poolIncrement: 5, // Number of connections to add when the pool is exhausted
          queueTimeout: 120000,
        });
      } else {
        throw error; // Rethrow unexpected errors
      }
    }

    // Get a connection from the pool
    const connection = await pool.getConnection();
    // Set default schema for the session
    await connection.execute(
      `ALTER SESSION SET CURRENT_SCHEMA = WKSP_SITESTHERE`
    );
    return connection;
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    throw error;
  }
}

async function testDbConnection() {
  try {
    const connection = await getConnection();
    const result = await connection.execute(`SELECT * FROM respo_entreprise`);
    // await connection.execute(
    //   `insert into entreprise (name, secteur, telephone, email, adresse) values ('oracle', 'informatique', 0666666666, 'oracle@gmail.com', 'casablanca') , ('microsoft', 'informatique', 06666666, 'microsoft@gmail.com', 'casablanca')`,
    //   { autoCommit: true }
    // );
    console.log("Query successful, data:", result.rows);
    await connection.close();
  } catch (err) {
    console.error("Database operation failed:", err);
  }
}

// Test the connection
testDbConnection();

module.exports = getConnection;
