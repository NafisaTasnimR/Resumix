const jwt = require('jsonwebtoken');
const Joi = require('joi');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // contains userId or email, etc.
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token." });
    }
};

const validateInformationUpdate = (req, res, next) => {
    const updateUserSchema = Joi.object({
        name: Joi.string().min(2).max(50),
        email: Joi.string().email(),
        phone: Joi.string().pattern(/^\+?\d{10,15}$/).message("Invalid phone number"),
        address: Joi.string().max(100)
    }).min(1);
    const { error } = updateUserSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return res.status(400).json({ errors: errorMessages });
    }

    next();
};