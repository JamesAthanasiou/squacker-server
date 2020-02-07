require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./handlers/error');
const authRoutes = require('./routes/auth');
const db = require("./models");
const messagesRoutes = require('./routes/messages');
const { loginRequired, ensureCorrectUser} = require('./middleware/auth');
// declaring port
const PORT = process.env.PORT || 8081;
// to access javascript from another origin
app.use(cors());
// to parse data from html requests
app.use(bodyParser.json());

// ROUTES
app.use('/api/auth', authRoutes);
app.use(
  '/api/users/:id/messages', 
  loginRequired, 
  ensureCorrectUser,
   messagesRoutes
);

app.get('/api/messages', loginRequired, async function (req, res, next){
  try {
    // find the messages that everyone has posted, sort in descending order
    // then also provide the username and profile picture with all the comments
    let messages = await db.Message.find()
      .sort({ createdAt: 'desc'})
      .populate('user', {
        username: true,
        profileImageUrl: true
      });
      return res.status(200).json(messages);
  } catch (err) {
    return next(err);
  }
});

app.use((req, res, next) => {
  // error is a standard js constructor
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Server has started');
});