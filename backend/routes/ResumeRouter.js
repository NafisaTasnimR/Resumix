const express = require('express');
const router = express.Router();
const { createResume, updateResume, getResumeById, getAllResumes, deleteResume } = require('../controllers/ResumeController');
const { verifyToken } = require('../middlewares/TokenVerification');

router.post('/create', verifyToken, createResume);
router.patch('/updateResume/:resumeId', verifyToken, updateResume);
router.get('/all', verifyToken, getAllResumes);
router.get('/:resumeId', verifyToken, getResumeById);
router.delete('/:resumeId', verifyToken, deleteResume);

module.exports = router;