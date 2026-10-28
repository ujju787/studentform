const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getProfile } = require('../controllers/studentController');

const router = express.Router();

// Protected route: requires valid JWT in Authorization: Bearer <token>
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
