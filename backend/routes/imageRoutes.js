const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const User = require('../models/User');

// Set up multer for image storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Route to handle image upload
router.post('/upload/:id',  upload.single('image'), async (req, res) => {

    const{id}=req.params
 
 const data = await User.findById(id) ;
data.imagePath=`http://localhost:5000/uploads/${req.file.filename}`;

    await data.save();

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(200).json({ message: 'Image uploaded successfully', filename: req.file.filename });
});

// Route to serve uploaded images
router.get('/images/:filename', (req, res) => {
    const { filename } = req.params;
    const filepath = path.join(__dirname, '../uploads', filename);
    res.sendFile(filepath);
});

module.exports = router;
