const joi = require('joi');

module.exports.register = {
  body: {
    email: joi.string().email().required(),
    name: joi.string().required(),
    password: joi.string().alphanum().min(3).max(30)
      .required(),
    designation: joi.string().required(),
    is_admin: joi.boolean(),
    is_premium: joi.boolean()
  },
};


