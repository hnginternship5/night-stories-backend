const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const User = mongoose.model('User')

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

  authenticate(password, hashPassword){
    return new Promise(async (resolve, reject)=>{
        try{
            //Match Password
            bcrypt.compare(password, hashPassword)
            if(err) throw err;
            if(isMatch){
                resolve('User authenticated')
            }
            else{
                //Passwords didn't match
                reject('Authentication failed')
            }
        }
        catch(err){
            //Email not fond
            reject('Authentication Failed')
        }
    })
  }
};
