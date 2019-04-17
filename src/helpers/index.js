const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const { jwtsecret } = require('../config');

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
    const { authorization } = req.headers;
    const { userId } = req.params;

    try {
      const decoded = jwt.verify(authorization, jwtsecret);
      if (decoded._id) {
        req.id = decoded.id;
        return next();
      }
      return res.status(401).json({
        status: 401,
        method: req.method,
        message: 'Unauthorized User',
        data: null,
      });

      //
    } catch (e) {
      return res.status(400).json({
        status: 400,
        method: req.method,
        message: 'Invalid token',
        data: null,
      });
    }
  },

  // check if token exists,
  // passing an empty token to jwt throws errors
  checkTokenExists(req, res, next) {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(400).json({
        status: 400,
        method: req.method,
        message: 'No token available',
        data: null,
      });
    }

    return next();
  },

  // decode token
  decodeToken(req, res) {
    const { authorization } = req.headers;
    return jwt.decode(authorization);
  },

  // decode admin token and return it
  checkAdmin(req, res, next) {
    const { authorization } = req.headers;

    const decoded = jwt.decode(authorization);
    if (decoded.admin) {
      return next();
    }

    return res.status(401).json({
      status: 401,
      method: req.method,
      message: 'Only Admin Access',
      data: null,
    });
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
