const mongoose = require('mongoose');
const { sendJSONResponse } = require('../../../helpers');
const jwt = require('jsonwebtoken')
const auth = require('../auth')

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

//Auth User Login
module.exports.login = async (req, res) =>{
  const {email, password} = req.body
    
  try{
      //Authenticate User
      const user = await auth.authenticate(email, password);

      //create JWT
      const token = jwt.sign(user.toJSON(), 'secret1', {
          expiresIn: '15m'
      } )


      const {iat, exp} = jwt.decode(token)
      res.send({iat, exp, token})
  }
  catch(err){
      //user Unauthorized
      return err
  }
}



