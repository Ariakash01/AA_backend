// backend/routes/authRoutes.js
const express = require('express');
const { signupUser, loginUser, getMe } = require('../controllers/authController');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', signupUser);

// POST /api/auth/login
router.post('/login', loginUser);

// GET /api/auth/me
router.get('/me', protect, getMe);



module.exports = router;
