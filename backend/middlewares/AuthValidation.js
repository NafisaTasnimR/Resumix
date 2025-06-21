const joi = require('joi');

const validateLogin = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(6).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

const validateSignup = (req, res, next) => {
    const schema = joi.object({
        username: joi.string().min(3).required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required()
       
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

module.exports = {
    validateLogin,
    validateSignup
};