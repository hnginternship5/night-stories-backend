const mongoose = require("mongoose");
const { sendJSONResponse, authenticate } = require("../../../helpers");
const jwt = require("jsonwebtoken");

const User = mongoose.model("User");

/**
   * Registers a new user
   * @method register
   * @memberof Users
   * @param {object} req
   * @param {object} res
   * @returns {(function|object)} Function next() or JSON object
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
      user.setPassword(password);
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

//Auth User Login
module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //Authenticate User
    const findUser = await User.findOne({email})

    if(findUser) authenticate(password, findUser.password);

    // const user = new User();
    // user.veri

    //create JWT
    const token = jwt.sign(user.toJSON(), "secret1", {
      expiresIn: "15m"
    });

    const { iat, exp } = jwt.decode(token);
    res.send({ iat, exp, token });
  } catch (err) {
    //user Unauthorized
    return err;
  }
};

module.exports.view_profile = async (req, res) => {
  const user = await User.findById({ _id: req.params.id });
  sendJSONResponse(res, 200, { user }, req.method, 'View Profile');
};

