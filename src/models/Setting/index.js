const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    app_name: {
        type: String,
        required: true
    },

    app_version: {
        type: String,
        required: true
    }
    
});

const Setting = mongoose.model('Setting', settingSchema);

module.exports = Setting;