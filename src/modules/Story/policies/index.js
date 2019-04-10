const joi = require('joi');

module.exports.create = {
  body: {
    title: joi.string().required(),
    description: joi.string().required(),
  },
};

