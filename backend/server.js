// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const marksheetRoutes = require('./routes/marksheetRoutes');
const imageRoutes = require('./routes/imageRoutes');
const path = require('path');
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', imageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/marksheets', marksheetRoutes);

// Home Route
app.get('/', (req, res) => {
    res.send('MERN Stack Application');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
