const Joi = require("joi");

const profileCompletionSchema =
  Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(6)
      .max(30)
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/)
      .message(
        "Password must be at least 6 characters long, include letters and numbers"
      )
      .required(),
    userProfession: Joi.string().min(3).max(50).required(),
    firstName: Joi.string(),
    lastName: Joi.string().optional(),
    profileCompleted: Joi.boolean()
  });

module.exports = { profileCompletionSchema };