const mongoose = require('mongoose');
const { Schema } = mongoose;

const storySchema = new Schema({
  cat_id: String,
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  release_date: {
    type: Date,
    default: Date.now,
  },
  views: Number,
  status: String,
  like_count: Number,
  // @raji Woked here
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  ],
  // Work ends here
});

const Story = mongoose.model('Story', storySchema);

module.exports = Story;

