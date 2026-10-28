const { pool } = require('../config/db');

// GET /api/student/profile
const getProfile = async (req, res) => {
  try {
    const studentId = req.user.id;

    const [rows] = await pool.query(
      `SELECT id, name, email, roll_number, course, department, phone, created_at
       FROM students
       WHERE id = ?`,
      [studentId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error('Error fetching student profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch student details.',
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
};
