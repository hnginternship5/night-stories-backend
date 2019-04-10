const jwt = require('jsonwebtoken');

module.exports = {
  sendJSONResponse(res, status, data, method, message) {
    res.status(status);
    res.json({
      status,
      method,
      message,
      data,
    });
  },
  catchErrors(fn) {
    const caught = (req, res, next) => fn(req, res, next).catch(next);
    return caught;
  },
  getCurrentTimeStamp() {
    return Math.floor(new Date().getTime() / 1000);
  },

  // check if token is valid,
  verifyToken(req, res, next) {
    const { token } = req.headers;

    try {
      jwt.verify(token, process.env.JWTSECRET);
    } catch (e) {
      return res.status(400).json({
        status: 400,
        method: req.method,
        message: 'Invalid token',
        data: null,
      });
    }

    return next();
  },

  // check if is token exists,
  // passing an empty token to jwt throws errors
  checkTokenExists(req, res, next) {
    const { token } = req.headers;

    if (!token) {
      return res.status(400).json({
        status: 400,
        method: req.method,
        message: 'No token available',
        data: null,
      });
    }

    return next();
  },

  // decode token and return it
  decodeToken(token) {
    return jwt.decode(token);
  },
};
