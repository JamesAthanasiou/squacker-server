const mongoose = require('mongoose');
const User = require('./user');

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      maxLength: 160
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// when delete message is called make sure that it is also removed from the user's message array
// TO BE FIXED: This function seems to never be actually used. 
messageSchema.pre('deleteOne', async function(next){
  try {
    let user = await User.findById(this.user);
    user.messages.deleteOne(this.id);
    await user.save();
    return next();
  } catch(err) {
    return next(err);
  }
});



const Message = mongoose.model('Message', messageSchema);
module.exports = Message;