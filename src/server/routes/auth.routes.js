const express = require('express');

require('dotenv').config();

// Imports the jwt module
const jwt = require('jsonwebtoken');

// Import the passport module
const passport = require('passport');

// Creates the router
const router = express.Router();

router.post('/login', passport.authenticate('local', {
    session: false
  }),
  async (req, res) => {
    try {
      const user = req.user;
      const token = jwt.sign(user.uuid, process.env.JWT_SECRET);
      res.status(200).json(
        {
          uuid: user.uuid,
          token,
          username: user.username,
          email: user.email,
          gamesPlayed: user.gamesPlayed,
          friends: user.friends
        });
    } catch (err) {
      res.status(401).json(err);
    }
  }
);

module.exports = router;
