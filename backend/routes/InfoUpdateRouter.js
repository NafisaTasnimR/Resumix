const express = require('express');
const router = express.Router();
const { updateInformation } = require('../controllers/InformationUpdateController');
const { verifyToken, validateInformationUpdate } = require('../middlewares/ResumeDataValidation');

router.patch('/update',verifyToken,validateInformationUpdate, updateInformation);

module.exports = router;