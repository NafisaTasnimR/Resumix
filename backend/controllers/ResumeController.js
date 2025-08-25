const bcrypt = require('bcrypt');
const UserModel = require('../models/User');
const ResumeModel = require('../models/Resume');
const mongoose = require('mongoose');


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

const updateResume = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { resumeId } = req.params; 
        
        const resume = await ResumeModel.findById(resumeId);
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        if (resume.userEmail !== req.user.email) {
            return res.status(403).json({ message: 'Unauthorized to update this resume' });
        }

        const updateFields = {};
        if (req.body.title !== undefined) {
            updateFields.title = req.body.title;
        }
        if (req.body.templateId !== undefined) {
            updateFields.templateId = req.body.templateId;
        }
        if (req.body.ResumeData !== undefined) {
            updateFields.ResumeData = req.body.ResumeData;
        }
        if (req.body.strength !== undefined)    updateFields.strength = req.body.strength;

        const updatedResume = await ResumeModel.findByIdAndUpdate(
            resumeId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: 'Resume updated successfully',
            resume: updatedResume
        });

    } catch (error) {
        console.error("Update Resume Error:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });       
    }
};

const getResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const userEmail = req.user?.email; // set by auth middleware

    if (!userEmail) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const resume = await ResumeModel
      .findOne({ _id: resumeId, userEmail }, { __v: 0 })
      .lean();

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    return res.status(200).json(resume);
  } catch (error) {
    console.error('Get Resume Error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const getAllResumes = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const resumes = await ResumeModel
      .find({ userEmail }, { __v: 0 })
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json(resumes);
  } catch (error) {
    console.error('Get All Resumes Error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = {
    createResume,
    updateResume,
    getResumeById,
    getAllResumes
};          


 