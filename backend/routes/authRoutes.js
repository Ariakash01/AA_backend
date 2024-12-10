
const express = require('express');

const { signupUser, loginUser, getMe , getAdvisorsByAdmin,
    getAdmins,
    updateUserProfile,
    updateAdvisor,
    deleteAdvisor,} = require('../controllers/authController');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();


router.post('/signup/:userId', signupUser);

router.post('/login', loginUser);


router.get('/me', protect, getMe);

// Get advisors by admin
router.get('/advisors/:userId',  getAdvisorsByAdmin);

router.put('/advisors_upd/:id', updateAdvisor);
router.delete('/advisors_del/:id',  deleteAdvisor);
router.get('/admins', getAdmins);

router.put('/admin/update/profile/:id', updateUserProfile)
module.exports = router;
