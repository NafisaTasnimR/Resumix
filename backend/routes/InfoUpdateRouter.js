const express = require('express');
const router = express.Router();
const { updateInformation } = require('../controllers/InformationUpdateController');
const { validateInformationUpdate } = require('../middlewares/ResumeDataValidation');
const { getUserInformation } = require('../controllers/InformationUpdateController');
const { verifyToken } = require('../middlewares/TokenVerification');

router.patch('/update',verifyToken,validateInformationUpdate, updateInformation);
router.get('/userInformation',verifyToken, getUserInformation);

module.exports = router;