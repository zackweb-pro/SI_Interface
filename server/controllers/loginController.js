const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = await getConnection();

    // Check if the user exists
    const query = `
      SELECT id, email, password, isconfirmed, type
      FROM (
        SELECT id, email, password, isconfirmed, 'respo_ecole' AS type FROM Respo_Ecole
        UNION ALL
        SELECT id, email, password, isconfirmed, 'respo_entreprise' AS type FROM Respo_Entreprise
        UNION ALL
        SELECT id, email, password, isconfirmed, 'admin' AS type FROM Admin
      ) WHERE email = :email
    `;
    const result = await connection.execute(query, { email });

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const [user] = result.rows;
    const [id, storedEmail, storedPassword, isConfirmed, type] = user;

    // Check if the account is confirmed
    if (isConfirmed === 0) {
      return res.status(403).json({ error: "Account not confirmed" });
    }

    // Compare the plain-text password with the stored password
    if (password !== storedPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT
    const token = jwt.sign({ id, email: storedEmail, type }, "your_secret_key", {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
};
