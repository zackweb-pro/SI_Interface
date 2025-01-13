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

const addBulkStudents = async (req, res, results) => {
    const { id_respo } = req.query;
    try {
      const connection = await getConnection();
  
      // Get id_ecole based on id_respo
      const ecoleIdQuery = `SELECT ECOLE_ID FROM Respo_Ecole WHERE id = :id_respo`;
      const ecoleIdResult = await connection.execute(ecoleIdQuery, { id_respo });
  
      if (ecoleIdResult.rows.length === 0) {
        return res.status(400).json({ error: "Respo_Ecole not found" });
      }
  
      const id_ecole = ecoleIdResult.rows[0][0];
      console.log("Ecole ID:", id_ecole);
  
      // Start the transaction with PL/SQL block
      const query = `
        DECLARE
          v_nom Etudiant.nom%TYPE;
          v_prenom Etudiant.prenom%TYPE;
          v_email Etudiant.email%TYPE;
          v_telephone Etudiant.telephone%TYPE;
          v_filiere Etudiant.filiere%TYPE;
          v_annee_scolarite Etudiant.annee_scolarite%TYPE;
          v_mdp VARCHAR2(255);
        BEGIN
          -- Loop through the provided results
          FOR i IN 1..:num_students LOOP
            v_nom := :nom(i);
            v_prenom := :prenom(i);
            v_email := :email(i);
            v_telephone := :telephone(i);
            v_filiere := :filiere(i);
            v_annee_scolarite := :annee_scolarite(i);
            v_mdp := DBMS_RANDOM.STRING('X', 16); -- Generate random password for each student
  
            INSERT INTO Etudiant (nom, prenom, email, telephone, mdp, filiere, annee_scolarite, id_ecole, id_respo, statut_etudiant, recupuration)
            VALUES (v_nom, v_prenom, v_email, v_telephone, v_mdp, v_filiere, v_annee_scolarite, :id_ecole, :id_respo, 0, 0);
          END LOOP;
        END;
      `;
  
      // Prepare the bind parameters for the query
      const bindParams = {
        num_students: results.length, // Number of students to loop over
        nom: results.map(r => r.nom),
        prenom: results.map(r => r.prenom),
        email: results.map(r => r.email),
        telephone: results.map(r => r.telephone),
        filiere: results.map(r => r.filiere),
        annee_scolarite: results.map(r => r.annee_scolarite),
        id_ecole, // Use the id_ecole fetched earlier
        id_respo // From the query parameter
      };
  
      // Execute the PL/SQL block
      await connection.execute(query, bindParams, { autoCommit: true });
      console.log("Students added successfully");
      res.status(201).json({ message: "Students added successfully" });
  
    } catch (dbError) {
      console.error("Database error during bulk insert:", dbError);
      res.status(500).json({ error: "Error adding students to the database" });
    }
  };
  
  const selectEntreprise = async (req, res) => {
    try {
        const { id_respo, id_entreprise, selected } = req.body;
        const connection = await getConnection();

        // Get `id_ecole` based on `id_respo`
        const id_ecoleResult = await connection.execute(
            `SELECT ECOLE_ID FROM Respo_Ecole WHERE id = :id_respo`,
            { id_respo }
        );

        if (id_ecoleResult.rows.length === 0) {
            return res.status(400).json({ error: "Respo_Ecole not found" });
        }

        const id_ecole = id_ecoleResult.rows[0][0];
        console.log("Ecole ID:", id_ecole, "Entreprise ID:", id_entreprise, "Selected:", selected);

        if (selected) {
            // Insert the selected entreprise
            try {
                const insertQuery = `
                    INSERT INTO Select_Entreprise (id_ecole, id_entreprise)
                    VALUES (:id_ecole, :id_entreprise)
                `;
                await connection.execute(insertQuery, { id_ecole, id_entreprise }, { autoCommit: true });

                res.status(200).json({ message: "Entreprise selected successfully" });
            } catch (insertError) {
                if (insertError.errorNum === 1) { // ORA-00001: Unique constraint violation
                    return res.status(400).json({ error: "Entreprise already selected" });
                }
                console.error("Error inserting entreprise:", insertError);
                return res.status(500).json({ error: "Failed to select entreprise" });
            }
        } else {
            // Unselect the entreprise
            const deleteQuery = `
                DELETE FROM Select_Entreprise
                WHERE id_ecole = :id_ecole AND id_entreprise = :id_entreprise
            `;
            const deleteResult = await connection.execute(deleteQuery, { id_ecole, id_entreprise }, { autoCommit: true });

            if (deleteResult.rowsAffected === 0) {
                return res.status(400).json({ error: "Entreprise was not selected previously" });
            }

            res.status(200).json({ message: "Entreprise unselected successfully" });
        }
    } catch (error) {
        console.error("Error selecting/unselecting entreprise:", error);
        res.status(500).json({ error: "Failed to select/unselect entreprise" });
    }
};

const getSelectedEntreprises = async (req, res) => {
    const id_respo = req.params.id_respo
    try {
        const connection = await getConnection();
        const id_ecoleResult = await connection.execute(`SELECT ECOLE_ID FROM Respo_Ecole WHERE id = :id_respo`, {id_respo})
        const id_ecole = id_ecoleResult.rows[0][0]
        const query = `select id_entreprise from Select_Entreprise where id_ecole = :id_ecole`
        const result = await connection.execute(query, {id_ecole})
        console.log("Results: -----------------------", result)
        res.status(200).json(result.rows)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to get selected entreprise" });
    }
}
async function getAllEntreprises(req, res) {
    let connection;
    try {
      connection = await getConnection();
      const result = await connection.execute(`SELECT * FROM Entreprise`);
      res.status(200).json(result.rows);
      console.log("Entreprise created successfully:", result);
  
    } catch (error) {
      console.error("Failed to retrieve entreprises:", error);
      res.status(500).json({ message: "Failed to retrieve entreprise.", error });
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
  
module.exports = { addStudent, addBulkStudents, selectEntreprise, getSelectedEntreprises, getAllEntreprises };