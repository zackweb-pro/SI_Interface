const flatted = require('flatted');
const getConnection = require("../config/dbConfig.js"); // Your Oracle DB connection
// Helper function to read CLOB data
const readClob = (lob) => {
  return new Promise((resolve, reject) => {
    if (!lob) {
      resolve("");
      return;
    }

    let clobData = "";
    lob.setEncoding("utf8");
    lob.on("data", (chunk) => {
      clobData += chunk;
    });
    lob.on("end", () => {
      resolve(clobData);
    });
    lob.on("error", (err) => {
      reject(err);
    });
  });
};
// Save or update CV
const setCv = async (req, res) => {
  const { userId, personalData, sections } = req.body;
  let db;

  try {
    db = await getConnection();

    // Delete the existing CV (cascade delete related data)
    await db.execute(`DELETE FROM cv WHERE etudiant_id = :userId`, [userId], { autoCommit: true });

    // Insert the new CV data (always insert this part, regardless of other sections)
    await db.execute(
      `INSERT INTO cv (name, title, pic_url, about_me, etudiant_id)
       VALUES (:name, :title, :pic_url, :about_me, :etudiant_id)`,
      {
        name: personalData.name,
        title: personalData.title,
        pic_url: personalData.image || null,
        about_me: sections.career.content || "",
        etudiant_id: userId,
      },
      { autoCommit: true }
    );

    // Retrieve the newly inserted CV ID
    const cvResult = await db.execute(
      "SELECT id FROM cv WHERE etudiant_id = :userId",
      [userId],
      { outFormat: db.OUT_FORMAT_OBJECT }
    );
    const cv_id = cvResult.rows[0][0];
    console.log("cv_id", cv_id);

    // Insert contacts (if provided)
    if (personalData.contacts !== undefined) {
      for (const contact of personalData.contacts) {
        await db.execute(
          `INSERT INTO contacts (cv_id, type, value) VALUES (:cv_id, :type, :value)`,
          { cv_id, type: contact.type, value: contact.value },
          { autoCommit: true }
        );
      }
    }

    // Insert education (if provided)
    if (sections.education !== undefined) {
      for (const edu of sections.education.items) {
        await db.execute(
          `INSERT INTO education (cv_id, title, authority, authority_website, date_range)
           VALUES (:cv_id, :title, :authority, :authority_website, :date_range)`,
          {
            cv_id,
            title: edu.title,
            authority: edu.authority,
            authority_website: edu.authorityWebSite || null,
            date_range: edu.rightSide || null,
          },
          { autoCommit: true }
        );
      }
    }

    // Insert experience (if provided)
    if (sections.experience !== undefined) {
      for (const exp of sections.experience.items) {
        await db.execute(
          `INSERT INTO experience (cv_id, title, company, company_website, description, dates_between)
           VALUES (:cv_id, :title, :company, :company_website, :description, :dates_between)`,
          {
            cv_id,
            title: exp.title,
            company: exp.company,
            company_website: exp.companyWebsite || null,
            description: exp.description || null,
            dates_between: exp.dates || null,
          },
          { autoCommit: true }
        );

        // Retrieve the experience_id
        const experienceResult = await db.execute(
          `SELECT id FROM experience WHERE cv_id = :cv_id AND title = :title AND company = :company`,
          { cv_id, title: exp.title, company: exp.company }
        );
        const experience_id = experienceResult.rows[0][0];
        console.log("Retrieved experience_id:", experience_id);

        // Insert experience tags (if provided)
        for (const tag of exp.tags || []) {
          await db.execute(
            `INSERT INTO experience_tags (experience_id, tag_name) VALUES (:experience_id, :tag_name)`,
            { experience_id, tag_name: tag },
            { autoCommit: true }
          );
        }
      }
    }

    // Insert projects (if provided)
    if (sections.projects !== undefined) {
      for (const project of sections.projects.groups[0].items) {
        await db.execute(
          `INSERT INTO projects (cv_id, section_header, title, project_url, project_description)
           VALUES (:cv_id, :section_header, :title, :project_url, :project_description)`,
          {
            cv_id,
            section_header: project.sectionHeader || null,
            title: project.title || null,
            project_url: project.url || null,
            project_description: project.description || null,
          },
          { autoCommit: true }
        );
      }
    }

    // Insert skills (if provided)
    if (sections.skills !== undefined) {
      for (const skill of sections.skills.items) {
        if (skill && skill.trim() !== '') {
          await db.execute(
            `INSERT INTO skills (cv_id, skill_name) VALUES (:cv_id, :skill_name)`,
            { cv_id, skill_name: skill },
            { autoCommit: true }
          );
        } else {
          console.log("Skipped inserting skill with invalid name:", skill);
        }
      }
    }

    // Insert languages (if provided)
    if (sections.languages !== undefined) {
      for (const lang of sections.languages.items) {
        if (lang && lang.authority && lang.authority.trim() !== '') {
          await db.execute(
            `INSERT INTO languages (cv_id, language_name, proficiency)
             VALUES (:cv_id, :language_name, :proficiency)`,
            {
              cv_id,
              language_name: lang.authority,
              proficiency: lang.authorityMeta || null,
            },
            { autoCommit: true }
          );
        } else {
          console.log("Skipped inserting language with invalid name:", lang);
        }
      }
    }

    // Insert loisirs (if provided)
    if (sections.loisirs !== undefined) {
      for (const loisir of sections.loisirs.items) {
        if (loisir && loisir.trim() !== '') {
          await db.execute(
            `INSERT INTO loisirs (cv_id, loisir_name) VALUES (:cv_id, :loisir_name)`,
            { cv_id, loisir_name: loisir },
            { autoCommit: true }
          );
        } else {
          console.log("Skipped inserting loisir with invalid name:", loisir);
        }
      }
    }

    // Respond with success message
    res.status(200).send({ message: "CV saved successfully!" });
  } catch (error) {
    console.error("Error saving CV:", error);
    res.status(500).send({ message: "An error occurred while saving the CV." });
  }
};



// Fetch CV by user ID
// const getCv = async (req, res) => {
//   const { userId } = req.params;
//   let db;

//   try {
//     db = await getConnection();

//     // Fetch personal data
//     const personalDataResult = await db.execute(
//       `SELECT * FROM cv WHERE etudiant_id = :userId`,
//       [userId]
//     );

//     const personalDataRow = personalDataResult.rows[0];
//     if (!personalDataRow) {
//       return res.status(404).send({ message: "CV not found." });
//     }

//     // Process personal data, including CLOB

//     const cvResult = await db.execute(
//       "SELECT id FROM cv WHERE etudiant_id = :userId",
//       [userId],
//       { outFormat: db.OUT_FORMAT_OBJECT }
//     );
//     const cv_id = cvResult.rows[0][0];
//     console.log("cv_id", cv_id);
//     // Fetch education data
//     const contactResult = await db.execute(
//       `SELECT type, value FROM contacts WHERE cv_id = :cv_id`,
//       [cv_id]
//     );
//     const contactItems = contactResult.rows.map((row) => ({
//       type: row[0],
//       value: row[1],
//     }));
//     const personalData = {
//       id: personalDataRow[0],
//       name: personalDataRow[1],
//       title: personalDataRow[2],
//       image: personalDataRow[3],
//       aboutMe: String(await readClob(personalDataRow[4])), // Assuming ABOUT_ME is a CLOB
//       otherField: personalDataRow[5],
//       contacts: contactItems,
//     };
//     // Fetch education data
//     const educationResult = await db.execute(
//       `SELECT title, authority, authority_WebSite, DATE_RANGE FROM education WHERE cv_id = :cv_id`,
//       [cv_id]
//     );
//     // console.log("educationResult", educationResult);
//     const educationItems = educationResult.rows.map((row) => ({
//       title: row[0],
//       authority: row[1],
//       authorityWebSite: row[2],
//       rightSide: row[3],
//     }));
    
    
//     // Fetch experience data
//     const experienceResult = await db.execute(
//       `SELECT title, company, company_WebSite, description, dates_Between FROM experience WHERE cv_id = :cv_id`,
//       [cv_id]
//     );
//     const experienceItems = experienceResult.rows.map((row) => ({
//       title: row[0],
//       company: row[1],
//       companyWebSite: row[2],
//       description: row[3],
//       // companyMeta: row[4],
//       descriptionTags: "",
//       datesBetween: row[5],
//     }));

//     // Fetch project data
//     const projectsResult = await db.execute(
//       `SELECT section_Header, description, title, project_Url, project_Description FROM projects WHERE cv_id = :cv_id`,
//       [cv_id]
//     );
    
//     // Extract items directly from the query result
//     const items = await Promise.all(
//       projectsResult.rows.map(async (row) => {
//         // Read the CLOB field if it exists
//         const description = String(await (row[4] && typeof row[4].getData === "function"
//           ? readClob(row[4]) // Convert the CLOB to a string
//           : Promise.resolve(row[4]))); // Use the value directly if it's not a CLOB
    
//         return {
//           title: row[2], // Project title
//           projectUrl: row[3], // Project URL
//           description, // Converted description string
//         };
//       })
//     );
    
  
//     // console.log("items", items);
//     // Wrap the entire structure in a `groups` array (if needed for the response)
//     // Fetch skills data
//     const skillsResult = await db.execute(
//       `SELECT skill_name FROM skills WHERE cv_id = :cv_id`,
//       [cv_id]
//     );
//     const skillsItems = skillsResult.rows.map((row) => row[0]);

//     // Fetch languages data
//     const languagesResult = await db.execute(
//       `SELECT language_name, proficiency FROM languages WHERE cv_id = :cv_id`,
//       [cv_id]
//     );
//     const languagesItems = languagesResult.rows.map((row) => ({
//       authority: row[0],
//       authorityMeta: row[1],
//     }));

//     // Fetch hobbies data
//     const hobbiesResult = await db.execute(
//       `SELECT loisir_name FROM loisirs WHERE cv_id = :cv_id`,
//       [cv_id]
//     );
//     const hobbiesItems = hobbiesResult.rows.map((row) => row[0]);

  
//     let sections = {
//       career: {
//         type: "text",
//         title: "About Me",
//         content: personalData.aboutMe || "",
//         icon: "plus",
//       },
//       education: {
//         type: "common-list",
//         title: "Education",
//         icon: "graduation",
//         items: educationItems,
//       },
//       experiences: {
//         type: "experiences-list",
//         title: "Experiences",
//         icon: "archive",
//         items: experienceItems,
//       },
//       projects: {
//         type: "projects-list",
//         title: "Projects",
//         description: "Voici quelques projets sur lesquels j'ai travaillé",
//         icon: "tasks",
//         groups: [
//           {
//             sectionHeader: "",
//             description: "",
//             items, // All project items
//           },
//         ],
//       },
//       skills: {
//         type: "tag-list",
//         title: "Skills Proficiency",
//         items: skillsItems,
//         icon: "rocket",
//       },
//       languages: {
//         type: "common-list",
//         title: "Languages",
//         items: languagesItems,
//         icon: "language",
//       },
//       loisirs: {
//         type: "tag-list",
//         title: "Hobbies",
//         items: hobbiesItems,
//         icon: "heart",
//       },
//     };

//     // Serialize and send the response safely
//     // const safeSections = removeCircularReferences(sections);
//     // const safePersonalData = removeCircularReferences(personalData);
//     console.log("safeSections", safeSections);
//     console.log("safePersonalData", safePersonalData);
//     res.status(200).send({ personalData, sections });

//   } catch (error) {
//     console.error("Error fetching CV:", error.message || error);
//     res.status(500).send({ message: "An error occurred while fetching the CV." });
//   } finally {
//     if (db) {
//       await db.close();
//     }
//   }
// };

// // Custom function to handle circular references
// function removeCircularReferences(obj) {
//   const seen = new WeakSet();
//   return JSON.parse(JSON.stringify(obj, (key, value) => {
//     if (typeof value === "object" && value !== null) {
//       if (seen.has(value)) {
//         return; // Remove circular reference
//       }
//       seen.add(value);
//     }
//     return value;
//   }));
// }

const getCv = async (req, res) => {
  const { userId } = req.params;
  let db;

  try {
    db = await getConnection();

    // Fetch personal data from CV table
    const cvResult = await db.execute(
      `SELECT id, name, title, pic_url, about_me FROM cv WHERE etudiant_id = :userId`,
      [userId],
      { outFormat: db.OUT_FORMAT_ARRAY } // Use ARRAY format for simpler indexing
    );

    if (!cvResult.rows || cvResult.rows.length === 0) {
      return res.status(404).json({ message: "CV not found" });
    }

    const cv = cvResult.rows[0]; // First (and only) row
    const cv_id = cv[0]; // ID is in the first column of the query
    console.log("cv_id", cv_id);
    // Initialize personal data and sections
    const personalData = {
      name: cv[1] || "",
      title: cv[2] || "",
      image: cv[3] || "",
      contacts: [],
    };

    const sections = {
      career: {
        type: "text",
        title: "About Me",
        content: cv[4] || "",
        icon: "plus",
      },
      education: {
        type: "common-list",
        title: "Education",
        icon: "graduation",
        items: [],
      },
      experiences: {
        type: "experiences-list",
        title: "Experiences",
        icon: "archive",
        items: [],
      },
      projects: {
        type: "projects-list",
        title: "Projects",
        icon: "tasks",
        groups: [{ sectionHeader: "", description: "", items: [] }],
      },
      skills: {
        type: "tag-list",
        title: "Skills Proficiency",
        icon: "rocket",
        items: [],
      },
      languanges: {
        type: "common-list",
        title: "Languages",
        icon: "language",
        items: [],
      },
      loisirs: {
        type: "tag-list",
        title: "Hobbies",
        icon: "heart",
        items: [],
      },
    };

    // Queries for related data
    const queries = [
      {
        query: `SELECT type, value FROM contacts WHERE cv_id = :cv_id`,
        mapRow: (row) => ({ type: row[0], value: row[1] }),
        target: personalData.contacts,
      },
      {
        query: `SELECT title, authority, authority_website, date_range FROM education WHERE cv_id = :cv_id`,
        mapRow: (row) => ({
          title: row[0],
          authority: row[1],
          authorityWebSite: row[2],
          rightSide: row[3],
        }),
        target: sections.education.items,
      },
      {
        query: `SELECT id, title, company, company_website, description, dates_between FROM experience WHERE cv_id = :cv_id`,
        mapRow: (row) => ({
          id: row[0],
          title: row[1],
          company: row[2],
          companyWebSite: row[3],
          description: row[4],
          datesBetween: row[5],
          tags: [],
        }),
        target: sections.experiences.items,
      },
      {
        query: `SELECT section_header, title, project_url, project_description FROM projects WHERE cv_id = :cv_id`,
        mapRow: (row) => ({
          sectionHeader: row[0],
          title: row[1],
          projectUrl: row[2],
          description: row[3],
        }),
        target: sections.projects.groups[0].items,
      },
      {
        query: `SELECT skill_name FROM skills WHERE cv_id = :cv_id`,
        mapRow: (row) => row[0],
        target: sections.skills.items,
      },
      {
        query: `SELECT language_name, proficiency FROM languages WHERE cv_id = :cv_id`,
        mapRow: (row) => ({
          authority: row[0],
          authorityMeta: row[1],
        }),
        target: sections.languanges.items,
      },
      {
        query: `SELECT loisir_name FROM loisirs WHERE cv_id = :cv_id`,
        mapRow: (row) => row[0],
        target: sections.loisirs.items,
      },
    ];

    // Fetch and map results for related data
    for (const { query, mapRow, target } of queries) {
      const result = await db.execute(query, [cv_id], { outFormat: db.OUT_FORMAT_ARRAY });
      if (result.rows && result.rows.length > 0) {
        target.push(...result.rows.map(mapRow));
      }
    }

    // Fetch tags for experiences
    for (const exp of sections.experiences.items) {
      const tagsResult = await db.execute(
        `SELECT tag_name FROM experience_tags WHERE experience_id = :expId`,
        [exp.id],
        { outFormat: db.OUT_FORMAT_ARRAY }
      );
      exp.tags = tagsResult.rows ? tagsResult.rows.map((row) => row[0]) : [];
    }

    // Respond with JSON containing plain data
    res.status(200).json({ personalData, sections });
  } catch (error) {
    console.error("Error fetching CV:", error.message);
    res.status(500).json({ message: "Error fetching CV" });
  } finally {
    if (db) {
      await db.close(); // Ensure the connection is closed
    }
  }
};





module.exports = {
    setCv,
    getCv,  
};
