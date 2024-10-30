// backend/routes/marksheetRoutes.js
const express = require('express');
const {
    createMarksheet,
    getMarksheets,
    getMarksheetById,
    deleteMarksheet,
    deleteMarksheets,
    updateMarksheet,
    marksheets,
    updateAllMarksheets,
    updatealll,
    updateRanks,
    getAllMarksheets,getMarksheetss, updateMarksheetss,getMarksheetsByTemplateName,getGroupedMarksheetsByUser
} = require('../controllers/marksheetController');
const marksheetsController = require('../controllers/marksheetController');

const protect = require('../middlewares/authMiddleware');

const router = express.Router();


router.use(protect);

router.get('/', getMarksheets);

router.get('/marksheet/:templateName', marksheets);

router.post('/', createMarksheet);

router.put('/:templateId/students', marksheetsController.updateStudentMarks);

router.delete(`/:_id`, deleteMarksheet);

router.delete('/mark/mar', marksheetsController.deleteMarksheets);







{/* 
    // GET /api/marksheets/:id
router.get('/:id', getMarksheetById);
    router.put('/:id', updateMarksheet);
router.put('/app/:templateId', marksheetsController.updateMarks);

router.put('updateAll', updateAllMarksheets);
router.post('/update_ranks',marksheetsController.updateRanks);


router.put('/updateAll', updatealll)
*/}
module.exports = router;
