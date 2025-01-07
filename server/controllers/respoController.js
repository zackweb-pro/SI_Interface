const getConnection = require("../config/dbConfig");

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

// Create a new Respo_Ecole
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
  
      // Use the provided `institution_id` if it exists, otherwise create a new institution
      let ecoleId = institution_id;
  
      if (!institution_id) {
        // Insert the new school and get its ID
        const insertEcoleQuery = `
          INSERT INTO Ecole (nom, adresse, contact_telephone, contact_email)
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
        INSERT INTO Respo_Ecole (nom, prenom, email, telephone, ecole_id)
        VALUES (:firstName, :lastName, :email, :phone, :ecoleId)
      `;
      await connection.execute(
        insertRespoQuery,
        { firstName, lastName, email, phone, ecoleId },
        { autoCommit: true }
      );
  
      res.status(201).json({ message: "Respo_Ecole created successfully" });
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
  
      // Use the provided `institution_id` if it exists, otherwise create a new institution
      let entrepriseId = institution_id;
  
      if (!institution_id) {
        // Insert the new company and get its ID
        const insertEntrepriseQuery = `
          INSERT INTO Entreprise (nom, domaine, contact_telephone, contact_email)
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
        INSERT INTO Respo_Entreprise (nom, prenom, email, telephone, entreprise_id)
        VALUES (:firstName, :lastName, :email, :phone, :entrepriseId)
      `;
      await connection.execute(
        insertRespoQuery,
        { firstName, lastName, email, phone, entrepriseId },
        { autoCommit: true }
      );
  
      res.status(201).json({ message: "Respo_Entreprise created successfully" });
    } catch (error) {
      console.error("Error creating Respo_Entreprise:", error);
      res.status(500).json({ error: "Failed to create Respo_Entreprise" });
    }
  };
  