const Joi = require('joi');

const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 3 characters',
      'string.max': 'Name cannot exceed 100 characters'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Invalid email format',
      'string.empty': 'Email is required'
    }),
    password: Joi.string().min(6).max(100).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'string.empty': 'Password is required'
    }),
    role: Joi.string().valid('student', 'examiner','admin').required().messages({
      'any.only': 'Role must be either student or examiner',
      'any.required': 'Role is required'
    })
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(err => ({
      field: err.context.key,
      message: err.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Invalid email format',
      'string.empty': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required'
    }),
    role: Joi.string().valid('student', 'examiner','admin').required().messages({
      'any.only': 'Role must be either student or examiner',
      'any.required': 'Role is required'
    })
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(err => ({
      field: err.context.key,
      message: err.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Bad Request',
      errors
    });
  }
  
  next();
};


module.exports = {
  signupValidation,
  loginValidation
};