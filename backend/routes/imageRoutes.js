const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const User = require('../models/User');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


router.post('/upload/:id',  upload.single('image'), async (req, res) => {

    const{id}=req.params
 
 const user = await User.findById(id) ;


 if (user.imagePath) {
   
fs.unlink(`./uploads/${user.imageName}`, async (err) => {
    if (err) {
        console.error('Error deleting image file:', err.message);
       
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


router.get('/images/:filename', (req, res) => {
    const { filename } = req.params;
    const filepath = path.join(__dirname, '../uploads', filename);
    res.sendFile(filepath);
});

module.exports = router;
