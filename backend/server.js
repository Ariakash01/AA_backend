// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const marksheetRoutes = require('./routes/marksheetRoutes');
const imageRoutes = require('./routes/imageRoutes');
const studentRouter = require('./routes/studentRouter');

const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json()); // For parsing JSON requests

// Directory to store generated PDFs
const PDF_DIR = path.join(__dirname, 'generated_pdfs');
if (!fs.existsSync(PDF_DIR)) {
    fs.mkdirSync(PDF_DIR, { recursive: true });
}

// Route to generate a PDF
app.post('/generate-pdf', async (req, res) => {
    const { htmlContent, filename } = req.body;

    if (!htmlContent || !filename) {
        return res.status(400).json({ message: 'HTML content and filename are required' });
    }

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        // Set the HTML content
        await page.setContent(htmlContent, { waitUntil: 'load' });

        // Define the path for the generated PDF
        const filePath = path.join(PDF_DIR, filename);

        // Generate the PDF
        await page.pdf({
            path: filePath,
            format: 'A4',
            printBackground: true,
        });

        await browser.close();

        // Return the relative file path for download
        res.json({ filePath: `/generated_pdfs/${filename}` });
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Failed to generate PDF' });
    }
});

// Serve PDFs as static files
app.use('/generated_pdfs', express.static(PDF_DIR));

// Other routes
app.use('/api', imageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/marksheets', marksheetRoutes);
app.use('/api/students', studentRouter);

// Default route
app.get('/', (req, res) => {
    res.send('MERN Stack Application');
});

// Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
