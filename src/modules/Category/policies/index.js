const joi = require('joi');

module.exports.create = {
  body: {
    name: joi.string().required(),
  },
};


module.exports.update = {
  body: {
    name: joi.string().required(),
  },
};

