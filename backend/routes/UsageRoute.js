// routes/usage.routes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/TokenVerification');

const {
  getUsage,
  checkUsage,
  consumeUsage,
} = require('../controllers/usage.controller');

// You should already have auth middleware that sets req.user.userId
// e.g., const { authMiddleware } = require('../middleware/auth');
// router.use(authMiddleware);

router.get('/',verifyToken,getUsage);
router.post('/check',verifyToken, checkUsage);
router.post('/consume',verifyToken, consumeUsage);

module.exports = router;
