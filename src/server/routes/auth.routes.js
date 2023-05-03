const express = require('express');

require('dotenv').config();

// Imports the jwt module
const jwt = require('jsonwebtoken');

// Imports the bcrypt module
const bcrypt = require('bcrypt');

// Imports the User module
const User = require('../db/models/user.model');

// Import the passport module
const passport = require('passport');

// Creates the router
const router = express.Router();

router.post('/login',
  passport.authenticate('local', { session: false }),
  async (req, res) => {
    try {
      // const token = jwt.sign(searchedUser.uuid, process.env.JWT_SECRET);
      const user = req.user;
      const newToken = jwt.sign(user.uuid, process.env.JWT_SECRET);
      res.status(200).json(
        {
          uuid: user.uuid,
          token: newToken,
          username: user.username,
          email: user.email,
          gamesPlayed: user.gamesPlayed,
          friends: user.friends
        }
      );
    } catch (err) {
      console.log('ERROR', err);
      res.status(401).json(err);
    }
  }
);

module.exports = router;
