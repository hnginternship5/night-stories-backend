const joi = require('joi');

module.exports.register = {
  body: {
    email: joi.string().email().required(),
    name: joi.string().required(),
    password: joi.string().alphanum().min(3).max(30)
      .required(),
  },
};

