const jwt = require("jsonwebtoken");
const getConnection = require("../config/dbConfig");
const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("email:", email);
  console.log("password:", password);
  try {
    const connection = await getConnection();

    // JWT secret key (make sure to keep this secure and use environment variables in production)
    const JWT_SECRET = "your_jwt_secret_key";

    // Query the Admin table
    const adminQuery = `SELECT id, nom, prenom, email FROM Admin WHERE email = :email AND password = :password`;
    const adminResult = await connection.execute(adminQuery, { email, password });

    
    if (adminResult.rows.length > 0) {
      const admin = adminResult.rows[0];
      console.log("Admin:", admin);
      const token = jwt.sign(
        { id: admin[0], role: "admin", email: admin[3], nom: admin[1], prenom: admin[2] },
        JWT_SECRET,
        { expiresIn: "24h" } // Token valid for 24 hours
      );
      return res.status(200).json({ message: "Login successful", token, user: { ...admin, role: "admin" } });
    }

    // Query the Respo_Ecole table
    const respoEcoleQuery = `SELECT id, nom, prenom, email, isconfirmed FROM Respo_Ecole WHERE email = :email AND password = :password`;
    const respoEcoleResult = await connection.execute(respoEcoleQuery, { email, password });

    if (respoEcoleResult.rows.length > 0) {
      const respoEcole = respoEcoleResult.rows[0];

      if (respoEcole.ISCONFIRMED === 0) {
        return res.status(403).json({ error: "Account not confirmed. Please contact the administrator." });
      }

      const token = jwt.sign(
        { id: respoEcole[0], role: "respo_ecole", email: respoEcole[3], nom: respoEcole[1], prenom: respoEcole[2] },
        JWT_SECRET,
        { expiresIn: "24h" }
      );
      return res.status(200).json({ message: "Login successful", token, user: { ...respoEcole, role: "respo_ecole" } });
    }

    // Query the Respo_Entreprise table
    const respoEntrepriseQuery = `SELECT id, nom, prenom, email, isconfirmed FROM Respo_Entreprise WHERE email = :email AND password = :password`;
    const respoEntrepriseResult = await connection.execute(respoEntrepriseQuery, { email, password });

    if (respoEntrepriseResult.rows.length > 0) {
      const respoEntreprise = respoEntrepriseResult.rows[0];

      if (respoEntreprise.ISCONFIRMED === 0) {
        return res.status(403).json({ error: "Account not confirmed. Please contact the administrator." });
      }

      const token = jwt.sign(
        { id: respoEntreprise[0], role: "respo_entreprise", email: respoEntreprise[3], nom: respoEntreprise[1], prenom: respoEntreprise[2] },
        JWT_SECRET,
        { expiresIn: "24h" }
      );
      return res.status(200).json({ message: "Login successful", token, user: { ...respoEntreprise, role: "respo_entreprise" } });
    }


    const etudiantQuery = `SELECT id, nom, prenom, email FROM etudiant WHERE email = :email AND MDP = :password`;
    const etudiantResult = await connection.execute(etudiantQuery, { email, password });

    
    if (etudiantResult.rows.length > 0) {
      const etudiant = etudiantResult.rows[0];
      const token = jwt.sign(
        { id: etudiant[0], role: "etudiant", email: etudiant[3], nom: etudiant[1], prenom: etudiant[2] },
        JWT_SECRET,
        { expiresIn: "24h" } // Token valid for 24 hours
      );
      return res.status(200).json({ message: "Login successful", token, user: { ...etudiant, role: "etudiant" } });
    }

    console.log("Etudiant result:", etudiantResult.rows);
    console.log("Admin result:", adminResult.rows);
    console.log("Respo Ecole result:", respoEcoleResult.rows);
    console.log("Respo Entreprise result:", respoEntrepriseResult.rows);
    // If no match is found
    return res.status(401).json({ error: "Invalid credentials" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
};
exports.login = login;
