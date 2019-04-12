const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
  },

  stories: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Story',
    },
  ],

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
