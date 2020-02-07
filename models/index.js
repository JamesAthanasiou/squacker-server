// connect to database and setup mongoose
const mongoose = require('mongoose');
mongoose.set('debug', true);
// to use ES2017 async functions
mongoose.Promise = Promise;
// currently set up for a local db
mongoose.connect( process.env.DATABASEURL || 'mongodb://localhost/squacker', {
  keepAlive: true
});

// by exporting these out message and user models can acess each other
module.exports.User = require('./user');
module.exports.Message = require('./message');
