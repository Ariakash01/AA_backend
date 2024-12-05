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


app.use(express.static('public'));


// Serve client build (if needed for production)


// Other routes
app.use('/api', imageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/marksheets', marksheetRoutes);
app.use('/api/students', studentRouter);

// Default route

app.post('/generate-pdf', async (req, res) => {
    const { htmlContent, filename } = req.body;

    try {
        const browser = await puppeteer.launch({
            headless: true, // Puppeteer runs in headless mode
            args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for some environments
        });

        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true, // Ensure the background colors/images are included
        });

        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename || 'document.pdf'}"`);
        res.send(pdfBuffer); // Send the PDF as a binary response
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Failed to generate PDF');
    }
});



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
