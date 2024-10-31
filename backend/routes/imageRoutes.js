const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const User = require('../models/User');
const fs = require('fs');
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
 
 const user = await User.findById(id) ;


 if (user) {
   
fs.unlink(`./uploads/${user.imageName}`, async (err) => {
    if (err) {
        console.error('Error deleting image file:', err.message);
        return res.status(500).json({ message: 'Error deleting image file' });
    }
});

 }

 
 user.imagePath=`${req.protocol}://${req.headers.host}/uploads/${req.file.filename}`;
 user.imageName=`${req.file.filename}`;
 
 
     await user.save();

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
