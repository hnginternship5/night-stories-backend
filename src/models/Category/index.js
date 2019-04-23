const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
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
  image: {
    type: String
  },
  imageId: {
    type: String
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
