const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const { sendJSONResponse } = require("../../../helpers");
const jwt = require("jsonwebtoken");
const auth = require("../../../helpers/auth");
const { jwtsecret } = require('../../../config');

const User = mongoose.model("User");

/**
   * Register user
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} res.json
   */
module.exports.register = async (req, res) => {
  const { name, email, password, designation, is_admin, is_premium } = req.body;

  User.findOne({ email: email }).then(user => {
    if (user) {
      return sendJSONResponse(
        res,
        409,
        null,
        req.method,
        "User Already Exists!"
      );
    } else {
      const user = new User();

      user.name = name;
      user.email = email;
      user.password = bcrypt.hashSync(password, 10);
      user.designation = designation;
      if (!is_admin) user.is_admin = false;
      if (!is_premium) user.is_premium = false;
      user.save();
      const token = user.generateJWT();
      sendJSONResponse(
        res,
        200,
        { token, user },
        req.method,
        "Created New User!"
      );
    }
  });
};

/**
   * Update User Profile
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} res.json
   */
module.exports.update = async (req, res) => {
  const { name, email, password } = req.body;
  User.findById(req.params.userId, (err, user) => {
    if (err) {
      return sendJSONResponse(res, 404, null, req.method, "User not Found!");
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
    sendJSONResponse(
      res,
      200,
      { user },
      req.method,
      "User Updated Succesfully!"
    );
  });
};

/**
   * Log In User
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} res.json
   */
module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = new User();

  //Get User by Email
  const findUser = await User.findOne({email});

  //Authenticate User
  if(findUser){
    const verifyPassword = await bcrypt.compare(password, findUser.password);
  
    const token = user.generateJWT();

    if(verifyPassword){
      sendJSONResponse(
        res,
        200,
        { token, findUser },
        req.method,
        "Login Successful!"
      );
    }
    else{
      //User password is wrong
      sendJSONResponse(res, 401, null, req.method, 'User Not Authenticated');
    }

  }else{
    //user Unauthorized
    sendJSONResponse(res, 404, null, req.method, 'User Not Found');
  }
};

/**
   * View User Profile
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} res.json
   */
module.exports.view_profile = async (req, res) => {
  const user = await User.findById({ _id: req.params.id });
  sendJSONResponse(res, 200, { user }, req.method, 'View Profile');
};

