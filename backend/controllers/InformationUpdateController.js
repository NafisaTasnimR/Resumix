const bcrypt = require('bcrypt');
const user = require('../models/User');

const updateInformation = async (req, res) => {
    try {
        const userId = req.user.userId;
        const updateFields = {};
        if (req.body.username !== undefined) {
            updateFields.username = req.body.username;
        }
        if (req.body.defaultResumeData !== undefined) {
            updateFields.defaultResumeData = req.body.defaultResumeData;
        }

        const updateUser = await user.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );
        res.status(200).json(updateUser);
    } catch (error) {
        console.error("Update Information Error:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message});       
    }
};

const getUserInformation = async (req, res) => {
    try {   
        const userId = req.user.userId;
        const userData = await user.findById(userId, 'username defaultResumeData');
        if (!userData) {    
            return res.status(404).json({ message: 'User not found' });
        }               
        res.status(200).json(userData);
    } catch (error) {   
        console.error("Get User Information Error:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = {
    updateInformation,
    getUserInformation
};           