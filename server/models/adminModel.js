const oracledb = require("oracledb");

class AdminModel {
  static async getAllAdmins() {
    const connection = await oracledb.getConnection();
    try {
      const result = await connection.execute("SELECT * FROM Admin", [], {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      });
      return result.rows;
    } finally {
      await connection.close();
    }
  }

  static async createAdmin(adminData) {
    const { nom, prenom, email, password } = adminData;
    const connection = await oracledb.getConnection();
    try {
      const result = await connection.execute(
        `INSERT INTO Admin (nom, prenom, email, password) VALUES (:1, :2, :3, :4)`,
        [nom, prenom, email, password],
        { autoCommit: true }
      );
      return result.rowsAffected;
    } finally {
      await connection.close();
    }
  }
}

module.exports = AdminModel;
