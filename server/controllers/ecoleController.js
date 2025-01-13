// backend/controllers/studentController.js
const getConnection = require("../config/dbConfig");
const crypto = require('crypto');
const csv = require('csv-parser');
const fs = require('fs');

const addStudent = async (req, res) => {
  const { nom, prenom, email, telephone, filiere, annee_scolarite, id_respo } = req.body;
  try {
    const connection = await getConnection();
console.log(id_respo);
    // Get id_ecole based on id_respo
    const ecoleIdQuery = `SELECT ECOLE_ID FROM Respo_Ecole WHERE id = :id_respo`;
    const ecoleIdResult = await connection.execute(ecoleIdQuery, { id_respo });

    if (ecoleIdResult.rows.length === 0) {
      return res.status(400).json({ error: "Respo_Ecole not found" });
    }
    const id_ecole = ecoleIdResult.rows[0][0];
    const generatedPassword = crypto.randomBytes(8).toString("hex");
    const query = `
      INSERT INTO Etudiant (nom, prenom, email, telephone, mdp, filiere, annee_scolarite, id_ecole, id_respo, statut_etudiant, recupuration)
      VALUES (:nom, :prenom, :email, :telephone, :mdp, :filiere, :annee_scolarite, :id_ecole, :id_respo, 0, 0)
    `;
    await connection.execute(query, { nom, prenom, email, telephone, mdp: generatedPassword, filiere, annee_scolarite, id_ecole, id_respo }, { autoCommit: true });
    res.status(201).json({ message: "Student added successfully", generatedPassword });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ error: "Failed to add student" });
  }
};

const addBulkStudents = async (req, res) => {
  try {
    const connection = await getConnection();
    const id_respo = req.query.id_respo;
    console.log(id_respo);
        // Get id_ecole based on id_respo (do this ONCE outside the loop)
    const ecoleIdQuery = `SELECT ECOLE_ID FROM Respo_Ecole WHERE id = :id_respo`;
       console.log(id_respo);
        const ecoleIdResult = await connection.execute(ecoleIdQuery, { id_respo });
        console.log(ecoleIdResult);
        if (ecoleIdResult.rows.length === 0) {
          return res.status(400).json({ error: "Respo_Ecole not found" });
        }
    
        const id_ecole = ecoleIdResult.rows[0][0];
    console.log(id_ecole);

        if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!fs.existsSync(req.file.path)) {
        return res.status(400).json({ error: "File not found after upload" });
    }
    const results = [];
    
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          await connection.execute("BEGIN");
          const generatedPasswords = {};

          for (const studentData of results) {
            const { nom, prenom, email, telephone, filiere, annee_scolarite } = studentData;

            if (!nom || !prenom || !email || !telephone || !filiere || !annee_scolarite) {
              await connection.execute("ROLLBACK");
              return res.status(400).json({ error: "Missing required fields in CSV file" });
            }
            const generatedPassword = crypto.randomBytes(8).toString("hex");
            const query = `
              INSERT INTO Etudiant (nom, prenom, email, telephone, mdp, filiere, annee_scolarite, id_ecole, id_respo, statut_etudiant, recupuration)
              VALUES (:nom, :prenom, :email, :telephone, :mdp, :filiere, :annee_scolarite, :id_ecole, :id_respo, 0, 0)
            `;
            await connection.execute(query, { nom, prenom, email, telephone, mdp: generatedPassword, filiere, annee_scolarite, id_ecole, id_respo });
            generatedPasswords[email] = generatedPassword;
          }

          await connection.execute("COMMIT");
          res.status(201).json({ message: "Students added successfully", generatedPasswords });
        } catch (dbError) {
          await connection.execute("ROLLBACK");
          console.error("Database error during bulk insert:", dbError);
          res.status(500).json({ error: "Error adding students to the database" });
        } finally {
          fs.unlinkSync(req.file.path);
        }
      });
  } catch (error) {
    console.error("Error processing CSV:", error);
    res.status(500).json({ error: "Error processing CSV file" });
  }
};

module.exports = { addStudent, addBulkStudents };