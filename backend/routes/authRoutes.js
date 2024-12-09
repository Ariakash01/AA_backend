
const express = require('express');

const { signupUser, loginUser, getMe , getAdvisorsByAdmin,

    updateAdvisor,
    deleteAdvisor,} = require('../controllers/authController');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();


router.post('/signup/:userId', signupUser);

router.post('/login', loginUser);


router.get('/me', protect, getMe);

// Get advisors by admin
router.get('/advisors/:user',  getAdvisorsByAdmin);

router.put('/advisors_upd/:id', updateAdvisor);
router.delete('/advisors_del/:id',  deleteAdvisor);


module.exports = router;
