const joi = require('joi');

module.exports.create = {
  body: {
    title: joi.string().required(),
    story: joi.string().required(),
    image: joi.string(),
    category: joi.string().required()
  },
};

