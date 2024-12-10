
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};


exports.signupUser = async (req, res) => {
    const { name, email,college, password, dept,confirmPassword,isAdmin } = req.body;
    const {userId}=req.params;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name,userId, email,college,dept, password,isAdmin });

    if (user) {
        res.status(201).json({
            _id: user._id,
            
            name: user.name,
            email: user.email,
            college:user.college,
            dept:user.dept,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};



exports.getAdvisorsByAdmin = async (req, res) => {
    try {
        const {userId }= req.params; // Assuming `req.user` contains authenticated user info
        const advisors = await User.find({ userId });
        res.status(200).json(advisors)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching advisors', error: error.message });
    }
};

// Create an advisor


// Update an advisor
exports.updateAdvisor = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedAdvisor = await User.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        if (!updatedAdvisor) {
            return res.status(404).json({ message: 'Advisor not found' });
        }

        res.status(200).json({ message: 'Advisor updated successfully', advisor: updatedAdvisor });
    } catch (error) {
        res.status(500).json({ message: 'Error updating advisor', error: error.message });
    }
};

// Delete an advisor
exports.deleteAdvisor = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAdvisor = await User.findByIdAndDelete(id);
        if (!deletedAdvisor) {
            return res.status(404).json({ message: 'Advisor not found' });
        }

        res.status(200).json({ message: 'Advisor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting advisor', error: error.message });
    }
};
exports.updateUserProfile = async (req, res) => {
    const { id } = req.params;
    const { name, email, dept, role } = req.body;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.dept = dept || user.dept;
        user.role = role || user.role;

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ message: 'Failed to update profile.' });
    }
};
exports.getAdmins = async (req, res) => {
    try {
        const admins = await User.find({ isAdmin: true });
        res.status(200).json(admins);
    } catch (err) {
        console.error('Error fetching admins:', err);
        res.status(500).json({ message: 'Failed to fetch admins.' });
    }
};

exports.getMe = async (req, res) => {
    res.status(200).json(req.user);
};