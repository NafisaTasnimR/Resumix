const express = require('express');
const router = express.Router();
const { createResume, updateResume, getResumeById, getAllResumes } = require('../controllers/ResumeController');
const { verifyToken } = require('../middlewares/TokenVerification');

router.post('/create', verifyToken, createResume);
router.patch('/updateResume/:resumeId', verifyToken, updateResume);
router.get('/:resumeId', verifyToken, getResumeById);
router.get('/all', verifyToken, getAllResumes);