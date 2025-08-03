const bcrypt = require('bcrypt');
const UserModel = require('../models/User');
const ResumeModel = require('../models/Resume');


const createResume = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { templateId, title, ResumeData } = req.body;

        const newResume = new ResumeModel({
            userEmail: user.email,
            templateId: templateId || 'default-template',
            title: title || 'Untitled',
            ResumeData: ResumeData
        });

        await newResume.save();

        res.status(201).json({
            message: 'Resume created successfully',
            resume: newResume
        });

    } catch (error) {
        console.error("Create Resume Error:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

 