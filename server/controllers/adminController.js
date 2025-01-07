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


const getDemandes = async (req, res) => {
  try {
    const connection = await getConnection();
    const query = `
      SELECT 
        r.id, r.nom, r.prenom, r.email, r.telephone, 
        r.isconfirmed, r.type,
        i.name AS institution_nom, i.email, i.telephone
      FROM (
        SELECT id, nom, prenom, email, telephone, isconfirmed, 'ecole' AS type, ecole_id AS institution_id 
        FROM Respo_Ecole WHERE isconfirmed = 0
        UNION ALL
        SELECT id, nom, prenom, email, telephone, isconfirmed, 'entreprise' AS type, entreprise_id AS institution_id 
        FROM Respo_Entreprise WHERE isconfirmed = 0
      ) r
      LEFT JOIN (
        SELECT id, name, email, telephone FROM Ecole
        UNION ALL
        SELECT id, name, email, telephone FROM Entreprise
      ) i ON r.institution_id = i.id
    `;
    const result = await connection.execute(query);

    const demandes = result.rows.map((row) => ({
      id: row[0],
      nom: row[1],
      prenom: row[2],
      email: row[3],
      telephone: row[4],
      isconfirmed: row[5],
      type: row[6],
      institution: {
        nom: row[7],
        contact_email: row[8],
        contact_telephone: row[9],
      },
    }));

    res.status(200).json(demandes);
  } catch (error) {
    console.error("Error fetching demandes:", error);
    res.status(500).json({ error: "Failed to fetch demandes" });
  }
};


const confirmDemande = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await getConnection();

    // Confirm the user
    const updateQuery = `
      UPDATE Respo_Ecole SET isconfirmed = 1 WHERE id = :id
      UNION ALL
      UPDATE Respo_Entreprise SET isconfirmed = 1 WHERE id = :id
    `;
    await connection.execute(updateQuery, { id }, { autoCommit: true });

    // Fetch the email and password to send
    const userQuery = `
      SELECT email, password FROM (
        SELECT email, password FROM Respo_Ecole WHERE id = :id
        UNION ALL
        SELECT email, password FROM Respo_Entreprise WHERE id = :id
      )
    `;
    const result = await connection.execute(userQuery, { id });
    const user = result.rows[0];

    // Send email (use nodemailer)
    sendEmail(user[0], "Account Confirmation", `Your account has been confirmed. Your password is ${user[1]}.`);

    res.status(200).json({ message: "Demande confirmed successfully" });
  } catch (error) {
    console.error("Error confirming demande:", error);
    res.status(500).json({ error: "Failed to confirm demande" });
  }
};


module.exports = {
  getAllAdmins,
  createAdmin,
  getDemandes,
  confirmDemande,
};
