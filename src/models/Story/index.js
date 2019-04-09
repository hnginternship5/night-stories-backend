const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  cat_id: String,
  story_title: {
    type: String,
    required: true,
  },
  story_description: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  story_release_date: {
    type: Date,
    default: Date.now,
  },
  story_views: Number,
  status: String,
});

module.exports = mongoose.model('Story', storySchema);

