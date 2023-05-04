const express = require('express');

require('dotenv').config();

// Imports the jwt module
const jwt = require('jsonwebtoken');

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
      res.cookie('session', newToken, {
        sameSite: 'strict',
        maxAge: 604800000,
        path: '/'
      });
      res.status(200).json(
        {
          uuid: user.uuid,
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

router.post('/logout', 
  (req, res) => {
    try {
      res.clearCookie('session').status(200).send('Usuario desconectado exitosamente');
    } catch (err) {
      res.status(500).json({ 'Error': err });
    }
  }
)

module.exports = router;
