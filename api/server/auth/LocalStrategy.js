// Imports the User module
const User = require('../db/models/user.model');

// Imports the bcrypt module
const bcrypt = require('bcrypt');

// Import the strategy 
const LocalStrategy = require('passport-local');

const logIn = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  const userLoggedIn = await User.findOne({ email: email });
  if(userLoggedIn) {
    const passwordAuthentication = await bcrypt.compare(password, userLoggedIn.password);
    if(passwordAuthentication) {
      return done(null, userLoggedIn);
    } else {
      return done(null, false, { message: 'Incorrect password.' });
    }
  } else {
    return done(null, false, { message: 'Incorrect email.' });
  }
});

module.exports = logIn;