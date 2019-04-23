const joi = require('joi');

module.exports.create = {
  file: {
    name: joi.string().required(),
  },
};


module.exports.update = {
  body: {
    name: joi.string(),
  },
};

