const mongoose = require('mongoose');

const { Schema } = mongoose;

const storySchema = new Schema({
  cat_id: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],
  title: {
    type: String,
    required: true,
  },
  story: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  author: {
    type: String,
  },
  image: {
    type: String,
  },
  imageId: {
    type: String,
  },
  release_date: {
    type: Date,
    default: Date.now,
  },
  views: Number,
  status: String,
  likes: {type:Number},
  dislikes: {type:Number},
  // @raji Woked here
  // likes: [
  //   {
  //     user: {
  //       type: Schema.Types.ObjectId,
  //       ref: 'User',
  //     },
  //   },
  // ],
  // Work ends here

  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
});

const Story = mongoose.model('Story', storySchema);

module.exports = Story;

