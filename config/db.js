const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool(process.env.DB_URL);

(async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ MySQL Connected");
    console.log(process.env.DB_URL);
    connection.release();
  } catch (err) {
    console.error("❌ Database connection failed:");
    console.error(err);
  }
})();

module.exports = db;