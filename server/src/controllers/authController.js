const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, roll_number, course, department, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password || !roll_number || !course || !department) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password, roll number, course, and department.',
      });
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Check if email or roll number already registered
    const [existing] = await pool.query(
      'SELECT id, email, roll_number FROM students WHERE email = ? OR roll_number = ?',
      [email.toLowerCase(), roll_number.trim()]
    );

    if (existing.length > 0) {
      const match = existing[0];
      if (match.email.toLowerCase() === email.toLowerCase()) {
        return res.status(409).json({
          success: false,
          message: 'A student with this email address is already registered.',
        });
      }
      if (match.roll_number.toLowerCase() === roll_number.trim().toLowerCase()) {
        return res.status(409).json({
          success: false,
          message: 'A student with this roll number is already registered.',
        });
      }
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert student record
    const [result] = await pool.query(
      `INSERT INTO students (name, email, password, roll_number, course, department, phone)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        email.toLowerCase().trim(),
        hashedPassword,
        roll_number.trim(),
        course.trim(),
        department.trim(),
        phone ? phone.trim() : null,
      ]
    );

    const newStudentId = result.insertId;

    // Generate JWT token
    const secret = process.env.JWT_SECRET || 'default_jwt_secret_key_change_in_production';
    const token = jwt.sign(
      { id: newStudentId, email: email.toLowerCase().trim() },
      secret,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Student registered successfully!',
      token,
      student: {
        id: newStudentId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        roll_number: roll_number.trim(),
        course: course.trim(),
        department: department.trim(),
        phone: phone ? phone.trim() : null,
      },
    });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration. Please check database connection.',
      error: error.message,
    });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    // Find student by email
    const [rows] = await pool.query(
      'SELECT * FROM students WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const student = rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET || 'default_jwt_secret_key_change_in_production';
    const token = jwt.sign(
      { id: student.id, email: student.email },
      secret,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        roll_number: student.roll_number,
        course: student.course,
        department: student.department,
        phone: student.phone,
        created_at: student.created_at,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login. Please check database connection.',
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};
