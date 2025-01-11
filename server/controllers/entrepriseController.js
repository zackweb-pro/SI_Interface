const getConnection = require("../config/dbConfig.js"); // Import your connection pool module

const createOffer = async (req, res) => {
  const { respo_id } = req.body; // The ID of the responsible person (logged-in user)
  const {
    titre,
    nature,
    description,
    requirements,
    status_offre,
    duree,
    ville,
  } = req.body;

  let connection;

  try {
    // Get a connection from the pool
    connection = await getConnection();

    // Fetch entreprise_id based on respo_id
    const entrepriseQuery =
      "SELECT entreprise_id FROM Respo_Entreprise WHERE id = :respo_id";
    const result = await connection.execute(entrepriseQuery, { respo_id });

    if (!result.rows.length) {
      return res.status(404).json({ error: "No entreprise found for respo_id" });
    }

    const entreprise_id = result.rows[0][0]; // Extract entreprise_id from the query result

    // Insert the new offer into the Offre table
    const insertQuery = `
      INSERT INTO Offres (
        titre,
        entreprise_id,
        id_responsable,
        nature,
        description,
        requirements,
        status_offre,
        duree,
        ville
      )
      VALUES (
        :titre,
        :entreprise_id,
        :respo_id,
        :nature,
        :description,
        :requirements,
        :status_offre,
        :duree,
        :ville
      )
    `;

    await connection.execute(
      insertQuery,
      {
        titre,
        entreprise_id,
        respo_id,
        nature,
        description,
        requirements,
        status_offre,
        duree,
        ville,
      },
      { autoCommit: true }
    );

    res.status(201).json({ message: "Offer created successfully!" });
  } catch (err) {
    console.error("Error during offer creation:", err);
    res.status(500).json({ error: "Failed to create offer" });
  } finally {
    // Release the connection back to the pool
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing the database connection:", err);
      }
    }
  }
};

module.exports = { createOffer };
