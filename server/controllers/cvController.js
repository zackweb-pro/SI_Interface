const getConnection = require("../config/dbConfig.js"); // Your Oracle DB connection

// Save or update CV
const setCv = async (req, res) => {
    const { userId, personalData, sections } = req.body;
    let db;
    try {
        console.log(userId, personalData, sections);
      db = await getConnection();
  
      // Delete the CV based on etudiant_id, which will trigger cascading deletes for related tables
      await db.execute(`DELETE FROM cv WHERE etudiant_id = :userId`, [userId]);
  
      // Insert or update the CV data
      await db.execute(
        `MERGE INTO cv USING DUAL
         ON (etudiant_id = :userId)
         WHEN MATCHED THEN UPDATE SET name = :name, title = :title, pic_url = :pic_url, about_me = :about_me
         WHEN NOT MATCHED THEN INSERT (etudiant_id, name, title, pic_url, about_me)
         VALUES (:userId, :name, :title, :pic_url, :about_me)`,
        {
          userId,
          name: personalData.name,
          title: personalData.title,
          pic_url: personalData.image || null,
          about_me: sections.career.content || "",
        }
      );
      const cv_id = await db.execute(`SELECT id FROM cv WHERE etudiant_id = :userId`, [userId]);
      console.log(cv_id);
      // Insert new contacts
      for (const contact of personalData.contacts) {
        await db.execute(
          `INSERT INTO contacts (cv_id, type, value) VALUES (:cv_id, :type, :value)`,
          { cv_id: userId, type: contact.type, value: contact.value }
        );
      }
  
      // Insert other sections (education, experience, skills, etc.)
      for (const edu of sections.education.items) {
        await db.execute(
          `INSERT INTO education (cv_id, title, authority, authority_website, date_range)
           VALUES (:cv_id, :title, :authority, :authority_website, :date_range)`,
          {
            cv_id: userId,
            title: edu.title,
            authority: edu.authority,
            authority_website: edu.authorityWebSite || null,
            date_range: edu.rightSide || null,
          }
        );
      }
  
      // Repeat for experience, skills, etc.
  
      res.status(200).send({ message: "CV saved successfully!" });
    } catch (error) {
      console.error("Error saving CV:", error);
      res.status(500).send({ message: "An error occurred while saving the CV." });
    }
  };
  
// Fetch CV by user ID
const getCv = async (req, res) => {
  const { userId } = req.params;
    let db;
  try {
    db = await getConnection();

    const personalDataResult = await db.execute(
      `SELECT * FROM cv WHERE id = :userId`,
      [userId]
    );

    const personalData = personalDataResult.rows[0];
    if (!personalData) {
      return res.status(404).send({ message: "CV not found." });
    }

    // Fetch related data (e.g., contacts, education, etc.)
    const contactsResult = await db.execute(
      `SELECT type, value FROM contacts WHERE cv_id = :userId`,
      [userId]
    );

    const sections = {
      career: { content: personalData.ABOUT_ME },
      education: { items: [] }, // Populate with fetched data
      experience: { items: [] }, // Populate with fetched data
      // Populate other sections...
    };

    res.status(200).send({ personalData, sections });
  } catch (error) {
    console.error("Error fetching CV:", error);
    res.status(500).send({ message: "An error occurred while fetching the CV." });
  }
};

module.exports = {
    setCv,
    getCv,  
};
