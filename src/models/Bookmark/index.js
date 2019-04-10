const Story = require('../Story/index.js');
const User = require('../User/index.js');
const mongoose = require('mongoose');
Schema = mongoose.Schema;

const bookmarkSchema = new mongoose.Schema({
    user : { type: Schema.Types.ObjectId, ref: 'User', required : true },
    story : { type: Schema.Types.ObjectId, ref: 'Story', required : true }
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;