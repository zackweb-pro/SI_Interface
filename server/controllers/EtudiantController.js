// backend/controllers/etudiantController.js
const oracledb = require('oracledb');
const getConnection = require("../config/dbConfig");

const getEtudiantsByEcole = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const id_respo = req.query.id_respo; // Get id_respo from req.query
        console.log(id_respo)
        const id_ecoleResult = await connection.execute(
            `SELECT ECOLE_ID FROM Respo_Ecole WHERE id = :id_respo`,
            { id_respo }
        );
        console.log(id_ecoleResult)
        if (id_ecoleResult.rows.length === 0) {
            return res.status(400).json({ error: "Respo_Ecole not found" });
        }

        const id_ecole = id_ecoleResult.rows[0][0];
        console.log(id_ecole);
        const id_ecoleNumber = parseInt(id_ecole, 10);

        if (isNaN(id_ecoleNumber)) {
            return res.status(400).json({ error: "Invalid id_ecole. Must be a valid integer." });
        }

        const query = `SELECT * FROM Etudiant WHERE id_ecole = :id_ecole`;
        const result = await connection.execute(query, { id_ecole: { val: id_ecoleNumber, type: oracledb.NUMBER } });
        console.log(result.rows);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching etudiants:", error);
        res.status(500).json({ error: error.message || "Failed to fetch etudiants" });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeError) {
                console.error("Error closing connection:", closeError);
            }
        }
    }
};

const deleteEtudiant = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const { id } = req.params; // Get the ID as a string

        console.log("Raw ID from req.params:", id); // Log the raw ID

        const idNumber = parseInt(id, 10);

        console.log("Parsed ID (idNumber):", idNumber); // Log the parsed number

        if (isNaN(idNumber)) {
            return res.status(400).json({ error: "Invalid student ID. Must be a valid integer." });
        }

        const query = `DELETE FROM Etudiant WHERE id = :id`;
        const result = await connection.execute(query, { id: { val: idNumber, type: oracledb.NUMBER } }, { autoCommit: true });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: "Student not found." });
        }

        res.status(200).json({ message: "Student deleted successfully.", rowsAffected: result.rowsAffected }); // Send rowsAffected

    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ error: error.message || "Failed to delete student." });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeError) {
                console.error("Error closing connection:", closeError);
            }
        }
    }
};
const updateEtudiant = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const { id, nom, prenom, email, telephone, motdepasse, filiere, annee_scolarite, statut_etudiant } = req.body;
        const idNumber = parseInt(id, 10);
        console.log(id);
        console.log(nom, prenom, email, telephone, motdepasse, filiere, annee_scolarite, statut_etudiant);
        if (isNaN(idNumber)) {
            return res.status(400).json({ error: "Invalid student ID. Must be a valid integer." });
        }
        if (!nom || !prenom || !email || !telephone || !motdepasse || !filiere || !annee_scolarite) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        const query = `
            UPDATE Etudiant 
            SET NOM = :NOM, PRENOM = :PRENOM, EMAIL = :EMAIL, TELEPHONE = :TELEPHONE, FILIERE = :FILIERE, ANNEE_SCOLARITE = :ANNEE_SCOLARITE, statut_etudiant = :Statut_Etudiant, MDP = :MDP
            WHERE id = :id
        `;

        const result = await connection.execute(query, {
            NOM: nom,
            PRENOM: prenom,
            EMAIL: email,
            TELEPHONE: telephone,
            FILIERE: filiere,
            ANNEE_SCOLARITE: annee_scolarite,
            Statut_Etudiant: statut_etudiant,
            MDP: motdepasse,
            id: { val: idNumber, type: oracledb.NUMBER }

        }, { autoCommit: true });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: "Student not found." });
        }

        res.status(200).json({ message: "Student updated successfully." });
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ error: error.message || "Failed to update student." });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeError) {
                console.error("Error closing connection:", closeError);
            }
        }
    }
};


module.exports = { getEtudiantsByEcole, deleteEtudiant, updateEtudiant };