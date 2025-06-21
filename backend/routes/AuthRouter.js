const { signup, login } = require('../controllers/AuthController');
const { validateSignup, validateLogin } = require('../middlewares/AuthValidation');

const router = require('express').Router();

router.post('/signup',validateSignup,signup)
router.post('/login',validateLogin,login)

module.exports = router;