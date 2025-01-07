const getConnection = require("../config/dbConfig");
const crypto = require("crypto");
const oracledb = require("oracledb");

// Fetch existing Ecoles
exports.getEcoles = async (req, res) => {
  try {
    const connection = await getConnection();
    const query = "SELECT id, name, domaine, telephone, email FROM Ecole";
    const result = await connection.execute(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching Ecoles:", error);
    res.status(500).json({ error: "Failed to fetch Ecoles" });
  }
};

// Fetch existing Entreprises
exports.getEntreprises = async (req, res) => {
  try {
    const connection = await getConnection();
    const query = "SELECT id, name, secteur, telephone, email FROM Entreprise";
    const result = await connection.execute(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching Entreprises:", error);
    res.status(500).json({ error: "Failed to fetch Entreprises" });
  }
};



exports.createRespoEcole = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    type,
    companyOrSchoolName,
    roleOrField,
    contactPhone,
    contactEmail,
    institution_id, // This is the ID of the selected institution (if applicable)
  } = req.body;

  try {
    const connection = await getConnection();

    // Generate a unique random password
    const generatedPassword = crypto.randomBytes(8).toString("hex"); // 16-character random password

    // Use the provided `institution_id` if it exists, otherwise create a new institution
    let ecoleId = institution_id;

    if (!institution_id) {
      // Insert the new school and get its ID
      const insertEcoleQuery = `
        INSERT INTO Ecole (name, domaine, telephone, email)
        VALUES (:companyOrSchoolName, :roleOrField, :contactPhone, :contactEmail)
        RETURNING id INTO :id
      `;
      const result = await connection.execute(
        insertEcoleQuery,
        {
          companyOrSchoolName,
          roleOrField,
          contactPhone,
          contactEmail,
          id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        },
        { autoCommit: true }
      );

      ecoleId = result.outBinds.id[0]; // Get the generated ID for the new school
    }

    // Insert the Respo_Ecole
    const insertRespoQuery = `
      INSERT INTO Respo_Ecole (nom, prenom, email, telephone, ecole_id, password, isConfirmed)
      VALUES (:firstName, :lastName, :email, :phone, :ecoleId, :password, 0)
    `;
    await connection.execute(
      insertRespoQuery,
      { firstName, lastName, email, phone, ecoleId, password: generatedPassword },
      { autoCommit: true }
    );

    res.status(201).json({
      message: "Respo_Ecole created successfully",
      generatedPassword, // Return the password to show it in the response
    });
  } catch (error) {
    console.error("Error creating Respo_Ecole:", error);
    res.status(500).json({ error: "Failed to create Respo_Ecole" });
  }
};

exports.createRespoEntreprise = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    type,
    companyOrSchoolName,
    roleOrField,
    contactPhone,
    contactEmail,
    institution_id, // This is the ID of the selected institution (if applicable)
  } = req.body;

  try {
    const connection = await getConnection();

    // Generate a unique random password
    const generatedPassword = crypto.randomBytes(8).toString("hex"); // 16-character random password

    // Use the provided `institution_id` if it exists, otherwise create a new institution
    let entrepriseId = institution_id;

    if (!institution_id) {
      // Insert the new company and get its ID
      const insertEntrepriseQuery = `
        INSERT INTO Entreprise (name, secteur, telephone, email)
        VALUES (:companyOrSchoolName, :roleOrField, :contactPhone, :contactEmail)
        RETURNING id INTO :id
      `;
      const result = await connection.execute(
        insertEntrepriseQuery,
        {
          companyOrSchoolName,
          roleOrField,
          contactPhone,
          contactEmail,
          id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        },
        { autoCommit: true }
      );

      entrepriseId = result.outBinds.id[0]; // Get the generated ID for the new company
    }

    // Insert the Respo_Entreprise
    const insertRespoQuery = `
      INSERT INTO Respo_Entreprise (nom, prenom, email, telephone, entreprise_id, password, isConfirmed)
      VALUES (:firstName, :lastName, :email, :phone, :entrepriseId, :password, 0)
    `;
    await connection.execute(
      insertRespoQuery,
      { firstName, lastName, email, phone, entrepriseId, password: generatedPassword },
      { autoCommit: true }
    );

    res.status(201).json({
      message: "Respo_Entreprise created successfully",
      generatedPassword, // Return the password to show it in the response
    });
  } catch (error) {
    console.error("Error creating Respo_Entreprise:", error);
    res.status(500).json({ error: "Failed to create Respo_Entreprise" });
  }
};
