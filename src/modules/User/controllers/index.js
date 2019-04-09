const mongoose = require('mongoose');
const { sendJSONResponse } = require('../../../helpers');

const User = mongoose.model('User');

module.exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = new User();
  user.name = name;
  user.email = email;
  user.setPassword(password);
  await user.save();
  const token = user.generateJWT();
  sendJSONResponse(res, 200, { token, user }, req.method, 'Created New User!');
};

module.exports.view_profile = async (req, res) => {
  const user = await User.findById({ _id: req.params.id });
  sendJSONResponse(res, 200, { user },req.method,'User Profile');
};


