const db = require("../config/db");

const findEmployeeByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM employees WHERE email = ?",
    [email]
  );

  return rows[0];
};

module.exports = {
  findEmployeeByEmail,
};