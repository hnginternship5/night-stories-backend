const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { sendJSONResponse } = require('../../../helpers');

const User = mongoose.model('User');

/**
   * Registers a new user
   * @method register
   * @memberof Users
   * @param {object} req
   * @param {object} res
   * @returns {(function|object)} Function next() or JSON object
   */
module.exports.register = async (req, res) => {
  const {
    name, email, password, designation, is_admin, is_premium, 
  } = req.body;

  const user = new User();
  User.findOne({ email }).then((findUser) => {
    if (findUser) {
      return sendJSONResponse(
        res,
        409,
        null,
        req.method,
        'User Already Exists!'
      );
    } 

      user.name = name;
      user.email = email;
      user.password = bcrypt.hashSync(password, 10);
      user.designation = designation;
      (!is_admin) ? user.is_admin = false : user.is_admin = true;
      (!is_premium) ? user.is_premium = false : user.is_premium = true;
      user.image = 'https://res.cloudinary.com/ephaig/image/upload/v1555015808/download.png';
      user.save();
      const token = user.generateJWT(user._id, name, email, user.is_admin);

      sendJSONResponse(
        res,
        200,
        {
          id: user._id,
          token,
          name: user.name,
          email: user.email,
          admin: user.is_admin,
          premium: user.is_premium,
          image: user.image,
          imageId: user.imageId,
          bookmark: user.bookmarks,
          bookmark_count: 0,
          liked: user.liked_story.length,
        },
        req.method,
        'Created New User!'
      );
    
  });
};

/**
   * Update User Profile
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} res.json
   */
module.exports.update = async (req, res) => {
  const {
    name, email, password, is_admin, is_premium, 
  } = req.body;
  const { userId } = req.params;

  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    return sendJSONResponse(res, 400, null, req.method, 'Invalid User ID');
  }

  const user = await User.findById(userId);

  if (user) {
    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    if (password) {
      user.password = bcrypt.hashSync(password, 10);
    }
    if (req.file) {

      try {
        const image = {};
      image.url = req.file.url;
      image.id = req.file.public_id;

      user.imageId = image.id;
      user.image = image.url;
      } catch (error) {
        return sendJSONResponse(res, 408, null, req.method, 'Bad Network');
      }
    }

    (is_admin) ? user.is_admin = is_admin : null;
    (is_premium) ? user.is_premium = is_premium : null;

    user.save();
    return sendJSONResponse(
      res,
      200,
      {
        id: user._id,
        name: user.name,
        email: user.email,
        admin: user.is_admin,
        premium: user.is_premium,
        image: user.image,
        bookmark: user.bookmarks,
        bookmark_count: user.bookmarks.length,
        liked: user.liked_story.length
        
      },
      req.method,
      'User Updated Succesfully!',
    );
      
    }

    return sendJSONResponse(res, 409, null, req.method, 'User not Found!');
 
};

/**
   * Log In User
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} res.json
   */
module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log(req.files)

  const user = new User();

  // Get User by Email
  const findUser = await User.findOne({ email });

  // Authenticate User
  if (findUser) {
    const verifyPassword = await bcrypt.compare(password, findUser.password);

    const token = user.generateJWT(findUser._id, findUser.name, findUser.email, findUser.is_admin);

    if (verifyPassword) {
      sendJSONResponse(
        res,
        200,
        {
          token,
          id: findUser._id,
          name: findUser.name,
          email: findUser.email,
          admin: findUser.is_admin,
          premium: findUser.is_premium,
          bookmark: findUser.bookmarks,
          bookmark_count: findUser.bookmarks.length,
          liked: findUser.liked_story.length,
          image: findUser.image,
          imageId: findUser.imageId
        },
        req.method,
        'Login Successful!',
      );
    } else {
      // User password is wrong
      sendJSONResponse(res, 401, null, req.method, 'User details incorrect');
    }
  } else {
    // user Unauthorized
    sendJSONResponse(res, 404, null, req.method, 'User details incorrect');
  }
};

/**
   * View User Profile
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} res.json
   */
module.exports.view_profile = async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return sendJSONResponse(res, 400, null, req.method, 'Invalid User ID');
  }

  const user = await User.findOne({ _id: id });

  if (user === null) {
    return sendJSONResponse(res, 404, null, req.method, 'User Not Found');
  }

  sendJSONResponse(
    res,
    200,
    {
      id: user._id,
      name: user.name,
      email: user.email,
      admin: user.is_admin,
      premium: user.is_premium,
      image: user.image,
      imageId: user.imageId,
      bookmark: user.bookmarks,
      bookmark_count: user.bookmarks.length,
      liked: user.liked_story.length
    },
    req.method,
    'View Profile',
  );
};

/**
   * Get all User Profile
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} res.json
   */
module.exports.allUsers = async (req, res) => {
  const except = {
    _v: false,
    password: false,
    salt: false,
    hash: false,
  };
  const user = await User.find({}, except);

  if (user) {
    sendJSONResponse(
      res,
      200,
      user,
      req.method,
      'All users',
    );
  } else {
    sendJSONResponse(res, 404, null, req.method, 'No user available');
  }
};

/**
   * Delete User
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} res.json
   */
module.exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    return sendJSONResponse(res, 400, null, req.method, 'Invalid User ID');
  }

  const user = await User.findById(userId);

  if (user === null) {
    return sendJSONResponse(res, 404, null, req.method, 'User Not Found');
  }

  // delete user
  await User.findOneAndRemove({ _id: userId });

  const except = {
    _v: false,
    password: false,
    salt: false,
    hash: false,
  };
  const reloadUser = await User.find({}, except);

  sendJSONResponse(
    res,
    200,
    { reloadUser },
    req.method,
    'User Deleted Successfully',
  );
};

