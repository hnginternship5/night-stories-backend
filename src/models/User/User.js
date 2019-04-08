const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    designation: {
        type: String
    },
    is_admin: {
        type: Boolean
    },
    is_premium: {
        type: Boolean
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})
