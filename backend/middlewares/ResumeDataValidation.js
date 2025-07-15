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
      fullName: Joi.string().required().allow(''),
      email: Joi.string().email().required(),
      dateOfBirth: Joi.date().optional().allow(null),
      phone: Joi.string().optional().allow(''),
      address: Joi.string().optional().allow(''),
      city: Joi.string().optional().allow(''),
      district: Joi.string().optional().allow(''),
      country: Joi.string().optional().allow(''),
      zipCode: Joi.string().optional().allow('')
    }).required(),

    education: Joi.array().items(
      Joi.object({
        institution: Joi.string().required(),
        degree: Joi.string().required(),
        fieldOfStudy: Joi.string().optional().allow(''),
        startDate: Joi.date().required(),
        endDate: Joi.date().optional().allow(null),
        graduationDate: Joi.date().optional().allow(null),
        isCurrentInstitute: Joi.boolean().optional(),
        city: Joi.string().optional().allow(''),
        state: Joi.string().optional().allow('')
      })
    ).optional(),

    experience: Joi.array().items(
      Joi.object({
        employerName: Joi.string().required(),
        jobTitle: Joi.string().required(),
        city: Joi.string().optional().allow(''),
        state: Joi.string().optional().allow(''),
        startDate: Joi.date().required(),
        endDate: Joi.date().optional().allow(null),
        isCurrentJob: Joi.boolean().optional()
      })
    ).optional(),

    skills: Joi.array().items(
      Joi.object({
        skillName: Joi.string().required(),
        proficiencyLevel: Joi.string().required(), 
        yearsOfExperience: Joi.number().optional(),
        skillDescription: Joi.string().optional().allow('')
      })
    ).optional(),

    achievements: Joi.array().items(
      Joi.object({
        title: Joi.string().required(),
        organization: Joi.string().optional().allow(''),
        dateReceived: Joi.date().optional().allow(null),
        category: Joi.string().optional().allow(''),
        description: Joi.string().optional().allow(''),
        website: Joi.string().optional().allow('')
      })
    ).optional(),

    references: Joi.array().items(
      Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        jobTitle: Joi.string().optional().allow(''),
        company: Joi.string().optional().allow(''),
        email: Joi.string().email().optional().allow(''),
        phone: Joi.string().optional().allow(''),
        relationship: Joi.string().optional().allow(''),
        description: Joi.string().optional().allow(''),
        permissionToContact: Joi.boolean().optional()
      })
    ).optional(),

    additionalSections: Joi.array().items(
      Joi.object({
        sectionTitle: Joi.string().required(),
        content: Joi.string().required()
      })
    ).optional(),

    projects: Joi.array().items(
      Joi.object({
        title: Joi.string().optional().allow(''),
        description: Joi.string().optional().allow(''),
        url: Joi.string().optional().allow('')
      })
    ).optional()
  });

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
