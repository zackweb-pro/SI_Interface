const express = require("express");
const {
  applyForOffer,
  getOffersByUser,
  getOffers,
  getCandidatures,
  approveCandidature,
  getApprovedCandidatures,
  confirmAttendance,
  getInterviewsByOfferId,
  addStage,
} = require("../controllers/offerController");

const router = express.Router();

// Get all admins
router.post("/", applyForOffer);
router.get("/:userId", getOffersByUser);
router.get("/get/:respo_id", getOffers);
router.get("/candidatures/:offer_id", getCandidatures);
router.post("/candidature/confirm/:id", approveCandidature);
router.get("/candidatures/approved/:user_id", getApprovedCandidatures);
router.put("/candidatures/confirm/:id", confirmAttendance);
router.get("/interviews/:offer_id", getInterviewsByOfferId);
router.post("/stages/:id_offre/:id_etudiant/:startDate/:endDate", addStage);

const oracledb = require("oracledb");
const getConnection = require("../config/dbConfig"); // Update with your Oracle DB connection configuration

// Fetch stages with student and offer details
router.get("/stages/:id", async (req, res) => {
  let connection;

  try {
    // Establish a connection to the database
    connection = await getConnection();
    const { id } = req.params;
    const query = `
      SELECT 
        s.nom AS student_name, 
        s.email AS student_email, 
        o.titre AS offer_title, 
        o.description AS offer_description, 
        o.duree AS offer_date, 
        se.starting_date as student_starting_date,
        se.ending_date as student_ending_date,
        se.statut_stage AS status
      FROM etudiant s
      JOIN stage se ON s.id = se.id_etudiant
      JOIN offres o ON o.offre_id = se.id_offre
      WHERE se.id_entreprise = :id
    `;

    // Execute the query
    const result = await connection.execute(query, [id], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    console.log(result.rows);
    // Send the query result as JSON
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching stages:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    // Ensure the connection is closed
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Error closing connection:", closeError);
      }
    }
  }
});

module.exports = router;
