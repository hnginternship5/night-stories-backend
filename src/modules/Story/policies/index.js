const joi = require('joi');

module.exports.create = {
  body: {
    title: joi.string().required(),
    story: joi.string().required(),
    image: joi.string().required(),
    category: joi.string().required(),
  },
};

module.exports.update = {
  body: {
    title: joi.string(),
    story: joi.string(),
    image: joi.string(),
    category: joi.string(),
  },
};

