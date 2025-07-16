const jwt = require('jsonwebtoken');
const Joi = require('joi');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token." });
    }
};

const validateInformationUpdate = (req, res, next) => {
  const defaultResumeDataSchema = Joi.object({
    personalInfo: Joi.object({
      fullName: Joi.string().allow('').optional(),
      email: Joi.string().email().allow('').optional(),
      dateOfBirth: Joi.date().allow(null).optional(),
      phone: Joi.string().allow('').optional(),
      address: Joi.string().allow('').optional(),
      city: Joi.string().allow('').optional(),
      district: Joi.string().allow('').optional(),
      country: Joi.string().allow('').optional(),
      zipCode: Joi.string().allow('').optional()
    }).optional(),

    // Keep all sections optional, no required fields
    education: Joi.array().items(Joi.object()).optional(),
    experience: Joi.array().items(Joi.object()).optional(),
    skills: Joi.array().items(Joi.object()).optional(),
    achievements: Joi.array().items(Joi.object()).optional(),
    references: Joi.array().items(Joi.object()).optional(),
    hobbies: Joi.array().items(Joi.object()).optional(),
    additionalInfos: Joi.array().items(Joi.object()).optional(),
    projects: Joi.array().items(Joi.object()).optional()
  }).optional();

  const updateUserSchema = Joi.object({
    username: Joi.string().min(3).trim().optional(),
    defaultResumeData: defaultResumeDataSchema.optional()
  }).min(1);

  const { error } = updateUserSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({ errors: errorMessages });
  }

  next();
};

module.exports = {
    verifyToken,
    validateInformationUpdate
};
