const express = require('express');
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const User = mongoose.model('./models/User/index')


exports.authenticate = (email, password) =>{
    return new Promise(async (resolve, reject)=>{
        try{
            //Get User by Email
            const user = await User.findOne({email})


            //Match Password
            bcrypt.compare(password, user.password)
            if(err) throw err;
            if(isMatch){
                resolve(user)
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