const getConnection = require("../config/dbConfig");

// Get all admins
async function getAllAdmins(req, res) {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(`SELECT * FROM Admin`);
    res.status(200).json(result.rows);
    console.log("Admin created successfully:", result);

  } catch (error) {
    console.error("Failed to retrieve admins:", error);
    res.status(500).json({ message: "Failed to retrieve admins.", error });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Failed to close connection:", closeError);
      }
    }
  }
}

// Create a new admin
async function createAdmin(req, res) {
  const { nom, prenom, email, password } = req.body;
  let connection;

  try {
    connection = await getConnection();
    const result = await connection.execute(
      `INSERT INTO Admin (NOM, PRENOM, EMAIL, PASSWORD) VALUES (:nom, :prenom, :email, :password)`,
      [nom, prenom, email, password],
      { autoCommit: true }
    );
    res.status(201).json({
      message: "Admin created successfully.",
      result,
    });
  } catch (error) {
    console.error("Failed to create admin:", error);
    res.status(500).json({ message: "Failed to create admin.", error });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Failed to close connection:", closeError);
      }
    }
  }
}

module.exports = {
  getAllAdmins,
  createAdmin,
};
