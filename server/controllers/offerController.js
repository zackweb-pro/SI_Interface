const path = require("path");
const fs = require("fs");
const oracledb = require("oracledb");
const db = require("oracledb");
const getConnection = require("../config/dbConfig"); // Adjust to your DB connection

const multer = require("multer");
const { get } = require("http");

// Configure Multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory for processing
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});


const applyForOffer = async (req, res) => {
  const uploadMiddleware = upload.single("cvFile");

  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: "Error processing file upload" });
    }

    try {
      const { id_offre, id_etudiant, motivation_letter_content } = req.body;
      const cvFile = req.file;

      if (!cvFile) {
        return res.status(400).json({ error: "CV file is required" });
      }

      const connection = await getConnection();

      // Save motivation letter to the database
      const letterResult = await connection.execute(
        `INSERT INTO motivation_letter (content) VALUES (:content) RETURNING id INTO :id`,
        {
          content: motivation_letter_content,
          id: { dir: db.BIND_OUT },
        },
        { autoCommit: true }
      );

      const letterId = letterResult.outBinds.id[0];

      // Generate a unique filename for the CV
      const uniqueFilename = `${Date.now()}-${cvFile.originalname}`;
      const uploadPath = path.join(__dirname, "../uploads/cvis", uniqueFilename);

      // Save the CV file to the filesystem
      fs.writeFileSync(uploadPath, cvFile.buffer);

      // Insert application data into the `candidature` table
      await connection.execute(
        `INSERT INTO candidature (id_cv, id_lettre, path_cv, id_offre, id_etudiant) 
         VALUES (:id_cv, :id_lettre, :path_cv, :id_offre, :id_etudiant)`,
        {
          id_cv: null, // If the `id_cv` is optional, replace null with actual value if available
          id_lettre: letterId,
          path_cv: uniqueFilename,
          id_offre,
          id_etudiant,
        },
        { autoCommit: true }
      );

      res.status(200).json({ message: "Application submitted successfully" });
    } catch (error) {
      console.error("Error applying for offer:", error);
      res.status(500).json({ error: "Failed to submit application" });
    }
  });
};





// Fetch offers based on relationships
const getOffersByUser = async (req, res) => {
    const { userId } = req.params; // Fetch the userId from the request parameters
    let connection;
  
    try {
      connection = await getConnection(); // Establish a connection to the OracleDB
  
      // Step 1: Fetch the student's school ID
      const ecoleResult = await connection.execute(
        `SELECT id_ecole FROM etudiant WHERE id = :userId`,
        { userId }, // Bind userId
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
  
      if (!ecoleResult.rows.length) {
        return res.status(404).json({ error: "Student not found" });
      }
  
      const id_ecole = ecoleResult.rows[0].ID_ECOLE; // Extract school ID
  
      // Step 2: Fetch the enterprise IDs linked to the school
      const entrepriseResult = await connection.execute(
        `SELECT id_entreprise FROM select_entreprise WHERE id_ecole = :id_ecole`,
        { id_ecole }, // Bind school ID
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
  
      const entrepriseIds = entrepriseResult.rows.map((row) => row.ID_ENTREPRISE);
  
      if (!entrepriseIds.length) {
        return res.status(404).json({ error: "No offers available for this user" });
      }
  
      // Step 3: Create placeholders for enterprise IDs dynamically
      const placeholders = entrepriseIds.map((_, index) => `:${index + 1}`).join(", ");
  
      // Step 4: Fetch offers for the enterprises
      const offerQuery = `
      SELECT 
        offres.*,
        entreprise.name AS entreprise_nom,
        entreprise.adresse AS entreprise_adresse,
        entreprise.telephone AS entreprise_telephone
      FROM offres
      INNER JOIN entreprise
        ON offres.entreprise_id = entreprise.id
      WHERE offres.entreprise_id IN (${placeholders})
    `;
    
  
      // Bind values dynamically
      const bindParams = {};
      entrepriseIds.forEach((id, index) => {
        bindParams[index + 1] = id;
      });
  
      const offerResult = await connection.execute(
        offerQuery,
        bindParams,
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
  
  
      return res.status(200).json(offerResult.rows);
    } catch (error) {
      console.error("Error fetching offers:", error);
      return res.status(500).json({ error: "Failed to fetch offers" });
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
  
  const getOffers = async (req, res) => {
 
    
  
    let connection;
  
    try {
        const userId = Number(req.params.respo_id);

        if (isNaN(userId)) {
          return res.status(400).json({ error: "Invalid respo_id provided." });
        }
      connection = await getConnection();
  
      const offerQuery = `
        SELECT 
          offres.*,
          entreprise.name AS entreprise_nom,
          entreprise.adresse AS entreprise_adresse,
          entreprise.telephone AS entreprise_telephone
        FROM offres
        INNER JOIN entreprise
          ON offres.entreprise_id = entreprise.id
        WHERE offres.id_responsable = :userId
      `;
  
      const offerResult = await connection.execute(
        offerQuery,
        { userId },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
  
      console.log("Offer Results:", offerResult.rows);
  
      return res.status(200).json(offerResult.rows);
    } catch (error) {
      console.error("Error fetching offers:", error);
      return res.status(500).json({ error: "Failed to fetch offers" });
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
  
  const getCandidatures = async (req, res) => {
    let connection;
  
    try {
      // Extract and validate offer_id
      const { offer_id } = req.params;
  
      if (!offer_id || isNaN(Number(offer_id))) {
        return res.status(400).json({ error: "Invalid or missing offer_id." });
      }
  
      const offerId = Number(offer_id); // Ensure offerId is a number
  
      connection = await getConnection(); // Get OracleDB connection
  
      const candidatureQuery = `
        SELECT 
          candidature.id AS candidature_id,
          candidature.id_etudiant,
          candidature.id_offre,
          candidature.date_interview,
          candidature.time_interview,
          candidature.place,
          candidature.is_approved,
          candidature.is_confirmed,
          candidature.path_cv,
          candidature.id_lettre,
  
          -- Motivational Letter
          motivation_letter.content AS motivational_letter,
  
          -- Student Details
          etudiant.nom AS etudiant_nom,
          etudiant.prenom AS etudiant_prenom,
          etudiant.email AS etudiant_email,
  
          -- Offer Details
          offres.titre AS offre_titre,
          offres.description AS offre_description,
  
          -- Enterprise Details
          entreprise.name AS entreprise_nom,
          entreprise.adresse AS entreprise_adresse,
          entreprise.telephone AS entreprise_telephone
  
        FROM candidature
        INNER JOIN offres
          ON candidature.id_offre = offres.offre_id
        INNER JOIN entreprise
          ON offres.entreprise_id = entreprise.id
        INNER JOIN motivation_letter
          ON candidature.id_lettre = motivation_letter.id
        INNER JOIN etudiant
          ON candidature.id_etudiant = etudiant.id
        WHERE candidature.id_offre = :offer_id
        AND candidature.is_approved = 0
      `;
  
      // Execute the query with bind parameters
      const offerResult = await connection.execute(
        candidatureQuery,
        { offer_id: offerId }, // Bind parameter
        { outFormat: oracledb.OUT_FORMAT_OBJECT } // Format as object
      );
  
      console.log("Candidature Results by Offer:", offerResult.rows);
  
      return res.status(200).json(offerResult.rows); // Return results
    } catch (error) {
      console.error("Error fetching candidatures by offer:", error);
      return res.status(500).json({ error: "Failed to fetch candidatures by offer." });
    } finally {
      if (connection) {
        try {
          await connection.close(); // Close connection
        } catch (closeError) {
          console.error("Error closing connection:", closeError);
        }
      }
    }
  };
  
  const approveCandidature = async (req, res) => {
    const { id } = req.params;
    const { date_interview, time_interview, place, is_approved } = req.body;
  
    let connection;
  
    try {
      connection = await getConnection(); // Get OracleDB connection
  
      const updateQuery = `
        UPDATE candidature
        SET 
          date_interview = TO_DATE(:date_interview, 'YYYY-MM-DD'),
          time_interview = TO_DATE(:time_interview, 'HH24:MI'),
          place = :place,
          is_approved = :is_approved
        WHERE id = :id
      `;
  
      await connection.execute(
        updateQuery,
        { date_interview, time_interview, place, is_approved, id },
        { autoCommit: true }
      );
  
      res.status(200).json({ message: "Candidature updated successfully." });
    } catch (error) {
      console.error("Error updating candidature:", error);
      res.status(500).json({ error: "Failed to update candidature." });
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
  
  const getApprovedCandidatures = async (req, res) => {
    let connection;
  
    try {
      connection = await getConnection(); // Get OracleDB connection
  
      const query = `
        SELECT 
          candidature.id AS candidature_id,
          candidature.id_etudiant,
          candidature.id_offre,
          candidature.date_interview,
          candidature.time_interview,
          candidature.place,
          candidature.is_approved,
          candidature.is_confirmed,
  
          etudiant.nom AS etudiant_nom,
          etudiant.prenom AS etudiant_prenom,
          etudiant.email AS etudiant_email,
  
          offres.titre AS offre_titre
        FROM candidature
        INNER JOIN etudiant ON candidature.id_etudiant = etudiant.id
        INNER JOIN offres ON candidature.id_offre = offres.offre_id
        WHERE candidature.is_approved = 1 AND candidature.is_confirmed = 0
      `;
  
      const result = await connection.execute(query, {}, { outFormat: oracledb.OUT_FORMAT_OBJECT });
      console.log("Approved Candidatures:", result.rows);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching candidatures:", error);
      res.status(500).json({ error: "Failed to fetch candidatures." });
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
  
  const confirmAttendance = async (req, res) => {
    const { id } = req.params; // Candidature ID
    let connection;
  
    try {
      connection = await getConnection(); // Get OracleDB connection
  
      const updateQuery = `
        UPDATE candidature
        SET is_confirmed = 1
        WHERE id = :id AND is_approved = 1 AND is_confirmed = 0
      `;
  
      const result = await connection.execute(
        updateQuery,
        { id },
        { autoCommit: true }
      );
  
      if (result.rowsAffected === 0) {
        return res.status(404).json({ error: "Candidature not found or already confirmed." });
      }
  
      res.status(200).json({ message: "Attendance confirmed successfully." });
    } catch (error) {
      console.error("Error confirming attendance:", error);
      res.status(500).json({ error: "Failed to confirm attendance." });
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
  
  
  
module.exports = {
    applyForOffer,
    getOffersByUser,
    getOffers,
    getCandidatures,
    approveCandidature,
    getApprovedCandidatures,
    confirmAttendance,
};