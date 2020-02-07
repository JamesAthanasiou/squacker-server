const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Message = require('./message');

// user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  profileImageUrl: {
    type: String
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    }
  ] 
  // include frineds in future
});

// a presave hook checking whether to hash password

userSchema.pre('save', async function(next) {
  try {
    // if password has not been changed, don't hash it
    if(!this.isModified('password')){
      return next();
    }
    // otherwise has the password
    let hashedPassword =  await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    return next();
  } catch(err) {
    // if error pass error to error handler
    return next(err);
  }
});

// add a method to userSchema, compare password to hash
userSchema.methods.comparePassword = async function (candidatePassword, next) {
  try {
    // compares hashed password with hash in db and returns t/f value
    let isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    return next(err);
  }
}

const User = mongoose.model('User', userSchema);

module.exports = User;