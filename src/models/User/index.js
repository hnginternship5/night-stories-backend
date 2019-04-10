const mongoose = require('mongoose');
const { randomBytes, pbkdf2Sync } = require('crypto');
const { sign } = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { jwtsecret } = require('../../config');

const userSchema = new mongoose.Schema({
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
    required: true
  },

}, { timestamps: true });

// userSchema.methods.setPassword = function userPassword(password) {
//   this.password = bcrypt.hashSync(password, 10);
//   //this.password = pbkdf2Sync(password, this.salt, 100, 64, 'sha512').toString('hex');
// };

// userSchema.methods.verifyPassword = function verify(password, hashPassword) {
//   return this.password === bcrypt.compare(password, hashPassword);
//   // this.salt = randomBytes(16).toString('hex');
//   // const hash = pbkdf2Sync(password, this.salt, 100, 64, 'sha512').toString('hex');
//   // return this.hash === hash;
// };

userSchema.methods.generateJWT = function generate() {
  return sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },
    jwtsecret,
    {
      expiresIn: '24h',
    },
  );
};

module.exports = mongoose.model('User', userSchema);
