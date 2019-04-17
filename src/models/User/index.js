const mongoose = require('mongoose');
const { sign } = require('jsonwebtoken');
const { jwtsecret } = require('../../config');

const { Schema } = mongoose;
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  designation: {
    type: String,
  },
  is_admin: {
    type: Boolean,
  },
  is_premium: {
    type: Boolean,
  },
  // @Brainz added image
  image: {
    type: String,
  },
  imageId: {
    type: String,
  },
  // @raji worked here
  liked_story: [
    {
      story: {
        type: Schema.Types.ObjectId,
        ref: 'Story',
      },
    },
  ],
  bookmarks: [
    {
      story: {
        type: Schema.Types.ObjectId,
        ref: 'Story',
      },
    },
  ],
  // End of work
  password: {
    type: String,
    required: true,
  }

}, { timestamps: true });

userSchema.methods.generateJWT = function generate(_id, name, email, admin) {
  return sign(
    {
      _id,
      name,
      email,
      admin,
    },
    jwtsecret,
    {
      expiresIn: '24h',
    },
  );
};

module.exports = mongoose.model('User', userSchema);
