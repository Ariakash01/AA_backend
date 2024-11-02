
const express = require('express');
const { signupUser, loginUser, getMe } = require('../controllers/authController');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();


router.post('/signup', signupUser);

router.post('/login', loginUser);


router.get('/me', protect, getMe);



module.exports = router;
