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
    type: String,
    default: 'https://res.cloudinary.com/ephaig/image/upload/v1555067803/top-best-storybook-apps-for-kids-i-love-you-all-the-time-3.jpg',
  },
  imageId: {
    type: String
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
