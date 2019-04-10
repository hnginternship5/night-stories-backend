const mongoose = require('mongoose');
const { randomBytes, pbkdf2Sync } = require('crypto');
const { sign } = require('jsonwebtoken');
const { jwtsecret } = require('../../config');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password:{type:String, required: true},
  designation: {
    type: String,
  },
  is_admin: {
    type: Boolean,
  },
  is_premium: {
    type: Boolean,
  },
//@raji worked here
  liked_story: [
    {
      story: {
        type: Schema.Types.ObjectId,
        ref: 'Story'
      }
    }
  ],
  bookmarks: [
    {
      story: {
        type: Schema.Types.ObjectId,
        ref: 'Story'
      }
    }
  ],
  //End of work
  hash: String,
  salt: String,

},
{ timestamps: true });

userSchema.methods.setPassword = function userPassword(password) {
  this.salt = randomBytes(16).toString('hex');
  this.hash = pbkdf2Sync(password, this.salt, 100, 64, 'sha512').toString('hex');
};

userSchema.methods.verifyPassword = function verify(password) {
  const hash = pbkdf2Sync(password, this.saly, 100, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

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
