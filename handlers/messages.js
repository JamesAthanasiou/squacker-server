const db = require('../models');

// /api/user/:id/messages

exports.createMessage = async function(req, res, next){
  try {
    // create a new message in the db
    let message = await db.Message.create({
      text: req.body.text,
      user: req.params.id
    });
    // find logged in user that created message
    let foundUser = await db.User.findById(req.params.id);
    // append the id of the newly created message to that user's array of messages
    foundUser.messages.push(message.id);
    await foundUser.save();
    // find the image that was just created and add to it the user that created it along with their profile picture
    // this means we don't have to requery the db later to display the message since it's all stored in the same document
    let foundMessage = await db.Message.findById(message._id).populate('user', {
      username: true,
      profileImageUrl: true
    });
    return res.status(200).json(foundMessage);
  } catch (err) {
    return next(err);
  }
};

exports.getMessage = async function(req, res, next){
  try {
    let message = await db.Message.find(req.params.message_id);
    return res.status(200).json(message);

  } catch (err) {
    return next(err);
  }
}; 

exports.deleteMessage = async function(req, res, next){
  try {
    
    // not going to use findByIdAndRemove because a hook is being used with the delete method and not findByIdAndDelete
    let foundMessage = await db.Message.findById(req.params.message_id);
    console.log(foundMessage)
    // let the record show that it took almost 3 hours to track down that .remove() should have been .deleteOne()
    await foundMessage.deleteOne();
    return res.status(200).json(foundMessage);
  } catch (err) {
    return next(err);
  }
};
