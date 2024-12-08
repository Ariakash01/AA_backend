
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




router.post('/upload-marks', async (req, res) => {
    const { t_nm, userId, marks } = req.body;
    let testName;

    if (!marks || !Array.isArray(marks)) {
        return res.status(400).json({ message: 'Invalid marks data' });
    }

    try {
        // Loop through all rows (marks)
        for (const row of marks) {
            const rollno = row['Roll Number'];

            // Fetch the student by roll number, user, and template name
            const student = await Marksheet.findOne({ rollno, userId, templateName: t_nm });
            let test=student.testName;
            testName=test
            if (!student) {
                console.log(`Student with Roll Number ${rollno} not found`);
                continue;
            }

            let pf_c = 0; // Pass count
            let count = 0; // Total subject count
            let new_sum_total_mark = 0;
            let new_sum_scored_mark = 0;

            // Loop through the subjects and update scored marks
            for (const [subjectName, scoredMark] of Object.entries(row)) {
                if (subjectName === 'Roll Number') continue;

                const subject = student.subjects.find(subj => subj.name === subjectName);
                if (subject) {
                    subject.scoredMark = scoredMark;
                } else {
                    // Add new subject if it doesn't exist
                    student.subjects.push({ name: subjectName, scoredMark });
                }

                // Pass/Fail logic
                if (scoredMark < 50) {
                    pf_c = pf_c - 1;
                } else {
                    pf_c = pf_c + 1;
                }
                count = count + 1;

                // Calculate the new total and scored marks for rank calculation
                new_sum_total_mark += subject?.totalMark || 100;
                new_sum_scored_mark += subject.scoredMark;
            }

            // Calculate pass/fail status based on the pass count
            if (pf_c < count) {
                student.status = "Fail";
            } else {
                student.status = "Pass";
            }

            // Update the total and scored marks
            student.sum_total_mark = new_sum_total_mark;
            student.sum_scored_mark = new_sum_scored_mark;

            // Save the updated student data
            await student.save();
        }

        // Get all "Pass" marksheets for ranking
        const passingMarksheets = await Marksheet.find({ userId, status: 'Pass', testName });

        // Sort passing marksheets based on the total scored marks in descending order
        passingMarksheets.sort((a, b) => b.sum_scored_mark - a.sum_scored_mark);

        // Update the rank for each passing marksheet
        for (let i = 0; i < passingMarksheets.length; i++) {
            passingMarksheets[i].rank = i + 1; // Rank starts from 1
            await passingMarksheets[i].save();
        }

        console.log("Ranks updated successfully.");
        res.status(200).json({ message: 'Marks updated successfully and ranks assigned' });

    } catch (error) {
        console.error('Error updating marks:', error);
        res.status(500).json({ message: 'Error updating marks', error: error.message });
    }
});



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
