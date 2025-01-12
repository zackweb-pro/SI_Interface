const getConnection = require("../config/dbConfig");
const { sendEmail } = require("../utils/sendMail");

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


const getDemandes = async (req, res) => {
  try {
    const connection = await getConnection();

    const ecoleQuery = `
      SELECT id, nom, prenom, email, telephone, isconfirmed, ecole_id
      FROM Respo_Ecole WHERE isconfirmed = 0
    `;

    const entrepriseQuery = `
      SELECT id, nom, prenom, email, telephone, isconfirmed, entreprise_id
      FROM Respo_Entreprise WHERE isconfirmed = 0
    `;

    const [ecoleResult, entrepriseResult] = await Promise.all([
      connection.execute(ecoleQuery),
      connection.execute(entrepriseQuery),
    ]);

    const ecoleDemandes = await Promise.all(ecoleResult.rows.map(async (row) => {
      const institutionQuery = `SELECT name, email, telephone, adresse, domaine FROM Ecole WHERE id = :id`;
      const institutionResult = await connection.execute(institutionQuery, { id: row[6] });
      const institution = institutionResult.rows[0] || { name: null, email: null, telephone: null }; // Handle cases where institution might not exist
      // console.log("Institution:", institution);
      // console.log("Row:", row[0], row[1], row[2], row[3], row[4], row[5]);
      return {
        id: row[0],
        nom: row[1],
        prenom: row[2],
        email: row[3],
        telephone: row[4],
        isconfirmed: row[5],
        type: 'ecole',
        institution: {
          nom: institution[0],
          contact_email: institution[1],
          contact_telephone: institution[2],
          adresse: institution[3],
          domaine: institution[4],
        },
      };
    }));

    const entrepriseDemandes = await Promise.all(entrepriseResult.rows.map(async (row) => {
      const institutionQuery = `SELECT name, email, telephone, adresse, secteur FROM Entreprise WHERE id = :id`;
      const institutionResult = await connection.execute(institutionQuery, { id: row[6] });
      const institution = institutionResult.rows[0] || { name: null, email: null, telephone: null };
      // console.log("Institution:", institution);
      // console.log("Rows:", row[0][0], row[1], row[2], row[3], row[4], row[5]);
      return {
        id: row[0],
        nom: row[1],
        prenom: row[2],
        email: row[3],
        telephone: row[4],
        isconfirmed: row[5],
        type: 'entreprise',
        institution: {
          nom: institution[0],
          contact_email: institution[1],
          contact_telephone: institution[2],
          adresse: institution[3],
          secteur: institution[4],
        },
      };
    }));

    const allDemandes = [...ecoleDemandes, ...entrepriseDemandes];

    res.status(200).json(allDemandes);
  } catch (error) {
    console.error("Error fetching demandes:", error);
    res.status(500).json({ error: "Failed to fetch demandes" });
  }
};


const confirmDemande = async (req, res) => {
  const { id, type } = req.params;

  try {
    const connection = await getConnection();

    // Validate the type
    if (!["ecole", "entreprise"].includes(type)) {
      return res.status(400).json({ error: "Invalid type specified." });
    }

    // Determine the table based on the type
    const table = type === "ecole" ? "Respo_Ecole" : "Respo_Entreprise";

    // Update `isconfirmed` in the specified table
    const updateQuery = `
      UPDATE ${table} 
      SET isconfirmed = 1
      WHERE id = :id AND isconfirmed = 0
    `;
    const updateResult = await connection.execute(updateQuery, { id }, { autoCommit: true });
    console.log("Update result:", updateResult);
    if (updateResult.rowsAffected === 0) {
      return res.status(404).json({ error: "Demande not found or already confirmed." });
    }

    // Fetch user email and password
    const userQuery = `
      SELECT email, password 
      FROM ${table} 
      WHERE id = :id
    `;
    const result = await connection.execute(userQuery, { id });
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const userEmail = user[0];
    const userPassword = user[1];

    // Send confirmation email
    await sendEmail(
      userEmail,
      "Account Confirmation",
      `Your account has been confirmed. Your login credentials are:
      Email: ${userEmail}
      Password: ${userPassword}`
    );

    res.status(200).json({ message: "Demande confirmed successfully and email sent." });
  } catch (error) {
    console.error("Error confirming demande:", error);
    res.status(500).json({ error: "Failed to confirm demande." });
  }
};


const removeDemande = async (req, res) => {
  const { id, type } = req.params;

  try {
    const connection = await getConnection();

    // Validate the type
    if (!["ecole", "entreprise"].includes(type)) {
      return res.status(400).json({ error: "Invalid type specified." });
    }

    // Determine the table based on the type
    const table = type === "ecole" ? "Respo_Ecole" : "Respo_Entreprise";

    // Delete the demande from the specified table
    const deleteQuery = `
      DELETE FROM ${table} 
      WHERE id = :id AND isconfirmed = 0
    `;
    const deleteResult = await connection.execute(deleteQuery, { id }, { autoCommit: true });

    if (deleteResult.rowsAffected === 0) {
      return res.status(404).json({ error: "Demande not found or already confirmed." });
    }

    res.status(200).json({ message: "Demande removed successfully." });
  } catch (error) {
    console.error("Error removing demande:", error);
    res.status(500).json({ error: "Failed to remove demande." });
  }
};


const getConfirmedUsers = async (req, res) => {
  try {
    const connection = await getConnection();

    // Step 1: Fetch Respo_Ecole users
    const respoEcoleQuery = `
      SELECT 
        r.id, r.nom, r.prenom, r.email, r.telephone, 
        'ecole' AS type, e.name AS institution_name
      FROM Respo_Ecole r
      JOIN Ecole e ON r.ecole_id = e.id
      WHERE r.isconfirmed = 1
    `;
    const respoEcoleResult = await connection.execute(respoEcoleQuery);
    const respoEcoleUsers = respoEcoleResult.rows.map((row) => ({
      id: row[0],
      nom: row[1],
      prenom: row[2],
      email: row[3],
      telephone: row[4],
      type: row[5],
      institution: row[6],
    }));

    // Step 2: Fetch Respo_Entreprise users
    const respoEntrepriseQuery = `
      SELECT 
        r.id, r.nom, r.prenom, r.email, r.telephone, 
        'entreprise' AS type, e.name AS institution_name
      FROM Respo_Entreprise r
      JOIN Entreprise e ON r.entreprise_id = e.id
      WHERE r.isconfirmed = 1
    `;
    const respoEntrepriseResult = await connection.execute(respoEntrepriseQuery);
    const respoEntrepriseUsers = respoEntrepriseResult.rows.map((row) => ({
      id: row[0],
      nom: row[1],
      prenom: row[2],
      email: row[3],
      telephone: row[4],
      type: row[5],
      institution: row[6],
    }));

    // Step 3: Combine the two lists
    const confirmedUsers = [...respoEcoleUsers, ...respoEntrepriseUsers];

    // Step 4: Sort the combined list by type and name
    confirmedUsers.sort((a, b) => {
      if (a.type === b.type) {
        return a.nom.localeCompare(b.nom);
      }
      return a.type.localeCompare(b.type);
    });

    res.status(200).json(confirmedUsers);
  } catch (error) {
    console.error("Error fetching confirmed users:", error);
    res.status(500).json({ error: "Failed to fetch confirmed users" });
  }
};


const deleteUser = async (req, res) => {
  const { id, type } = req.params;

  try {
    const connection = await getConnection();

    let deleteQuery = "";
    if (type === "ecole") {
      deleteQuery = "DELETE FROM Respo_Ecole WHERE id = :id";
    } else if (type === "entreprise") {
      deleteQuery = "DELETE FROM Respo_Entreprise WHERE id = :id";
    } else {
      return res.status(400).json({ error: "Invalid type" });
    }

    await connection.execute(deleteQuery, { id }, { autoCommit: true });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
module.exports = {
  getAllAdmins,
  createAdmin,
  getDemandes,
  confirmDemande,
  removeDemande,
  deleteUser,
  getConfirmedUsers,
};
