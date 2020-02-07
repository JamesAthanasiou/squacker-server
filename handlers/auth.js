const db = require('../models');
const jwt = require('jsonwebtoken');

exports.signin = async function(req, res, next){
  try {
    let user = await db.User.findOne({
      email: req.body.email
    });
    let { id, username, profileImageUrl } = user;
    let isMatch = await user.comparePassword(req.body.password);
    if(isMatch){
      let token = jwt.sign({
        id,
        username,
        profileImageUrl
      }, process.env.SECRET_KEY);
      return res.status(200).json({
        id,
        username,
        profileImageUrl,
        token
      });
    } else {
      return next({
        status: 400,
        message: 'Invalid email and/or password'
      });
    }
  } catch(err) {
    return next({
      status: 400,
      message: 'Invalid email and/or password'
    });
  }
}

// signup
exports.signup = async function(req, res, next){
  try {
    // create user
    let user = await db.User.create(req.body);
    // destructure object
    let { id, username, profileImageUrl } = user;
    // create token
    let token = jwt.sign({
      id,
      username,
      profileImageUrl
    }, process.env.SECRET_KEY
    );
    return res.status(200).json({
      id,
      username,
      profileImageUrl,
      token
    });
  } catch(err) {
    // if validation fails, err.code will be 11000
    if (err.code === 11000) {
      err.message = 'Sorry, the username and/or email is taken.';
    }
    return next({
      status: 400,
      message: err.message
    });
  }
};