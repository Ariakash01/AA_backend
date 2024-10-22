// backend/controllers/marksheetController.js
const Marksheet = require('../models/Marksheet');

// Create a new marksheet template
exports.createMarksheet = async (req, res) => {
    const userId = req.user._id;
    const data = req.body;

    const marksheet = new Marksheet({
        ...data,
        userId,
    });

    try {
        const createdMarksheet = await marksheet.save();
        res.status(201).json(createdMarksheet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all marksheet templates for the logged-in user
exports.getMarksheets = async (req, res) => {
    const userId = req.user._id;
    try {
        const marksheets = await Marksheet.find({ userId });
        res.json(marksheets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single marksheet by ID
exports.getMarksheetById = async (req, res) => {
    const { id } = req.params;
    try {
        const marksheet = await Marksheet.findOne({ _id: id, userId: req.user._id });
        if (marksheet) {
            res.json(marksheet);
        } else {
            res.status(404).json({ message: 'Marksheet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a marksheet template
exports.deleteMarksheet = async (req, res) => {
    const { id } = req.params;
    try {
        const marksheet = await Marksheet.findOneAndDelete({ _id: id, userId: req.user._id });
        if (marksheet) {
            res.json({ message: 'Marksheet deleted successfully' });
        } else {
            res.status(404).json({ message: 'Marksheet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a marksheet template
exports.updateMarksheet = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const marksheet = await Marksheet.findOneAndUpdate(
            { _id: id, userId: req.user._id },
            data,
            { new: true }
        );
        if (marksheet) {
            res.json(marksheet);
        } else {
            res.status(404).json({ message: 'Marksheet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getAllMarksheets = async (req, res) => {
    try {
        const marksheets = await Marksheet.find(); // Assuming you're using MongoDB
        res.status(200).json(marksheets);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch marksheets', error });
    }
};
