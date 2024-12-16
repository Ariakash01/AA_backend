
const express = require('express');
const Marksheet = require('../models/Marksheet');

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

router.get('/ms/:userr', getMarksheets);

router.get('/marksheet/:templateName/:user', marksheets);

router.post('/:user', createMarksheet);

router.put('/:templateId/students', marksheetsController.updateStudentMarks);

router.delete('/mark/:user/mar', marksheetsController.deleteMarksheets);

router.delete(`/:_id`, deleteMarksheet);


router.put('/upload-marks', async (req, res) => {
    console.log("Processing marks upload...");
    const { t_nm, userId, marks } = req.body;

    if (!t_nm || !userId || !Array.isArray(marks)) {
        return res.status(400).json({ message: 'Invalid input data. Please provide test name, user ID, and marks as an array.' });
    }

    try {
        for (const row of marks) {
            const rollno = row['RollNumber'];
            if (!rollno) {
                console.log(`Skipping row without RollNumber:`, row);
                continue;
            }

            const student = await Marksheet.findOne({ rollno, userId, testName: t_nm });
            if (!student) {
                console.log(`Student with Roll Number ${rollno} not found.`);
                continue;
            }

            // Update attendance and attendanceRate
            if (row.Attendances) {
                student.attendanceRate = row.Attendances;
                student.attendance = ((row.Attendances / student.total_class) * 100).toFixed(2);
            }

            // Update other direct fields
            if (row.StudentName) student.stu_name = row.StudentName;
            if (row.ToAddress) student.toAddress = row.ToAddress;
            if (row.Remarks) student.remarks = row.Remarks;

            // Update or add subjects and their scores
            let passCount = 0;
            let subjectCount = 0;
            let sumTotalMarks = 0;
            let sumScoredMarks = 0;

            for (const [key, value] of Object.entries(row)) {
                if (['RollNumber', 'Attendances', 'StudentName', 'ToAddress', 'Remarks'].includes(key)) continue;

                const scoredMark = parseFloat(value || 0);
                const subject = student.subjects.find(subj => subj.name === key);

                if (subject) {
                    subject.scoredMark = scoredMark;
                } else {
                    student.subjects.push({ name: key, scoredMark });
                }

                if (scoredMark >= 50) passCount++;
                subjectCount++;
                sumTotalMarks += subject?.totalMark || 100;
                sumScoredMarks += scoredMark;
            }

            student.status = passCount === subjectCount ? 'Pass' : 'Fail';
            student.sum_total_mark = sumTotalMarks;
            student.sum_scored_mark = sumScoredMarks;

            await student.save();
        }

        // Rank the students who passed
        const passingMarksheets = await Marksheet.find({ userId, testName: t_nm, status: 'Pass' });
        passingMarksheets.sort((a, b) => b.sum_scored_mark - a.sum_scored_mark);

        for (let i = 0; i < passingMarksheets.length; i++) {
            passingMarksheets[i].rank = i + 1;
            await passingMarksheets[i].save();
        }

        res.status(200).json({ message: 'Marks updated successfully and ranks assigned.' });
    } catch (error) {
        console.error('Error updating marks:', error);
        res.status(500).json({ message: 'Error updating marks.', error: error.message });
    }
});

/*
router.put('/upload-marks', async (req, res) => {
    console.log("hgfghfff")
    const { t_nm, userId, marks } = req.body;
    console.log("2hgfghfff")

console.log(t_nm);
    if (!t_nm || !userId || !Array.isArray(marks)) {
        return res.status(400).json({ message: 'Invalid input data. Please provide test name, user ID, and marks as an array.' });
    }

    try {
        for (const row of marks) {
            const rollno = row['RollNumber'];
            if (!rollno) {
                console.log(`Skipping row without RollNumber:`, row);
                continue;
            }

            const student = await Marksheet.findOne({ rollno, userId, testName: t_nm });
            if (!student) {
                console.log(`Student with Roll Number ${rollno} not found.`);
                continue;
            }
           if (row.Attendances) {
                student.attendanceRate=row.Attendances;
                student.attendance = ((row.Attendances /   student.total_class) * 100).toFixed(2);
            } 
            if (row.StudentName){ student.stu_name = row.StudentName;}
            
               
                if (row.ToAddress) { student.toAddress = row.ToAddress;}
            if (row.Remarks){  student.remarks =row.Remarks;}
            
            let passCount = 0;
            let subjectCount = 0;
            let sumTotalMarks = 0;
            let sumScoredMarks = 0;

            for (const [subjectName, scoredMark] of Object.entries(row)) {
                if (subjectName === 'RollNumber') continue;

                const score = parseFloat(scoredMark || 0);
                const subject = student.subjects.find(subj => subj.name === subjectName);

                if (subject) {
                    subject.scoredMark = score;
                } else {
                    student.subjects.push({ name: subjectName, scoredMark: score });
                }

                if (score >= 50) passCount++;
                subjectCount++;
                sumTotalMarks += subject?.totalMark || 100;
                sumScoredMarks += score;
            }

            student.status = passCount === subjectCount ? 'Pass' : 'Fail';
            student.sum_total_mark = sumTotalMarks;
            student.sum_scored_mark = sumScoredMarks;

            await student.save();
        }

        const passingMarksheets = await Marksheet.find({ userId, testName: t_nm, status: 'Pass' });
        passingMarksheets.sort((a, b) => b.sum_scored_mark - a.sum_scored_mark);

        for (let i = 0; i < passingMarksheets.length; i++) {
            passingMarksheets[i].rank = i + 1;
            await passingMarksheets[i].save();
        }

        res.status(200).json({ message: 'Marks updated successfully and ranks assigned.' });
    } catch (error) {
        console.error('Error updating marks:', error);
        res.status(500).json({ message: 'Error updating marks.', error: error.message });
    }
});
*/


router.post('/generate-pdf', async (req, res) => {
    const { htmlContent, filename } = req.body;

    try {
        // Launch Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Load the HTML content
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0', // Ensures all resources are loaded
        });

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
        });

        await browser.close();

        // Save or return PDF
        const filePath = path.join(__dirname, `../pdfs/${filename || 'marksheet'}.pdf`);
        fs.writeFileSync(filePath, pdfBuffer);

        res.status(200).json({ message: 'PDF generated successfully', filePath });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
});



router.post('/generate-all-pdfs', async (req, res) => {
    const { htmlContents, filename } = req.body; // Expect an array of HTML content for all marksheets

    try {
        // Launch Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Create a blank PDF document
        const pdfBuffers = [];
        for (const htmlContent of htmlContents) {
            // Set the HTML content for each marksheet
            await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

            // Generate PDF for the current marksheet
            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
            });

            pdfBuffers.push(pdfBuffer);
        }

        await browser.close();

        // Combine all buffers into a single PDF
        const combinedFilePath = path.join(__dirname, `../pdfs/${filename || 'All_Marksheets'}.pdf`);
        const outputStream = fs.createWriteStream(combinedFilePath);

        pdfBuffers.forEach((buffer) => outputStream.write(buffer));
        outputStream.end();

        res.status(200).json({ message: 'PDFs generated successfully', filePath: combinedFilePath });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to generate PDFs' });
    }
});


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
