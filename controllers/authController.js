const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// REGISTER
const register = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      department,
      role,
    } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        message: "All required fields are mandatory",
      });
    }

    // Check existing employee
    const [existing] = await db.query(
      "SELECT * FROM employees WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Employee already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO employees
      (full_name,email,password,department,role)
      VALUES (?,?,?,?,?)`,
      [
        full_name,
        email,
        hashedPassword,
        department || "",
        role || "Employee",
      ]
    );

    res.status(201).json({
      success: true,
      message: "Employee Registered Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM employees WHERE email=?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Invalid Email or Password",
      });
    }

    const employee = rows[0];

    const isMatch = await bcrypt.compare(
      password,
      employee.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Email or Password",
      });
    }

    const token = jwt.sign(
      {
        id: employee.id,
        email: employee.email,
        role: employee.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    delete employee.password;

    res.json({
      success: true,
      token,
      employee,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  register,
  login,
};