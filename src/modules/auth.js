const express = require('express');

const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = mongoose.model('./models/user/index')
const auth = require('../auth')


const router = express.Router()

//Auth User
router.post('/auth', async(req, res)=>{
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
})