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
    nom,
    prenom,
    email,
    telephone,
    password,
    ecole_id,
  } = req.body;

  try {
    const connection = await getConnection();
    const query = `
      INSERT INTO Respo_Ecole (nom, prenom, email, telephone, password, ecole_id)
      VALUES (:nom, :prenom, :email, :telephone, :password, :ecole_id)
    `;
    await connection.execute(query, [nom, prenom, email, telephone, password, ecole_id], { autoCommit: true });
    res.status(201).json({ message: "Respo_Ecole created successfully" });
  } catch (error) {
    console.error("Error creating Respo_Ecole:", error);
    res.status(500).json({ error: "Failed to create Respo_Ecole" });
  }
};

// Create a new Respo_Entreprise
exports.createRespoEntreprise = async (req, res) => {
  const {
    nom,
    prenom,
    email,
    telephone,
    password,
    entreprise_id,
  } = req.body;

  try {
    const connection = await getConnection();
    const query = `
      INSERT INTO Respo_Entreprise (nom, prenom, email, telephone, password, entreprise_id)
      VALUES (:nom, :prenom, :email, :telephone, :password, :entreprise_id)
    `;
    await connection.execute(query, [nom, prenom, email, telephone, password, entreprise_id], { autoCommit: true });
    res.status(201).json({ message: "Respo_Entreprise created successfully" });
  } catch (error) {
    console.error("Error creating Respo_Entreprise:", error);
    res.status(500).json({ error: "Failed to create Respo_Entreprise" });
  }
};
