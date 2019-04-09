const mongoose = require('mongoose');
const { sendJSONResponse } = require('../../../helpers');

const User = mongoose.model('User');

module.exports.register = async (req, res) => {
  const { name, email, password, designation, is_admin, is_premium } = req.body;
  
  User.findOne({ email: email }).then(user => {
    if(user){
      return sendJSONResponse(res, 409, "Registration failed!", req.method, 'User Already Exists!');
    } else{
      const user = new User();

      user.name = name;
      user.email = email;
      user.setPassword(password);
      user.designation = designation;
      if(!is_admin) user.is_admin = false;
      if(!is_premium) user.is_premium = false;


      user.save();
      const token = user.generateJWT();
      sendJSONResponse(res, 200, { token, user }, req.method, 'Created New User!');
    }
  })
};


module.exports.update = async (req, res) => {
  const { name, email, password } = req.body;
  User.findById(req.params.userId, (err, user) => {
    if (err) {
      return sendJSONResponse(res, 404, null, req.method, 'User not Found!');
    }
    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    if (password) {
      user.setPassword(password);
    }
    user.save();
    sendJSONResponse(res, 200, { user }, req.method, 'User Updated Succesfully!');
  });
};



