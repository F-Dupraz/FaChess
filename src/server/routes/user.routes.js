const express = require('express');

// Imports the uuid module
const { v4 } = require('uuid');

// Imports the passport module
const passport = require('passport');

// Imports the bcrypt module
const bcrypt = require('bcrypt');

// Imports the User module
const User = require('../db/models/user.model');

// Creates the router
const router = express.Router();

// Finds all suers
router.get('/all', passport.authenticate('jwt', {
    session: false,
  }),
  async (req, res, next) => {
    try {
      // Searchs all users in the DB
      const users = await User.find();

      res.status(200).json(users);
    } catch (err) {
      res.json(err);
    }
  }
);

// Finds a user by uuid
router.get('/one', passport.authenticate('jwt', {
    session: false,
  }),
  async (req, res, next) => {
    try {
      // Require the data
      const uuidParam = req.user;
      // Searchs a user in the DB with this uuid
      const user = await User.findOne({ uuid: uuidParam });
      // If something was returned
      if(user) {
        res.status(200).json(
          {
            uuid: user.uuid,
            username: user.username,
            email: user.email,
            gamesPlayed: user.gamesPlayed,
            friends: user.friends
          });
      } else {
        res.status(404).json(
          {
            "Error": "Username does not exists."
          });
      }
    } catch (err) {
      res.json(err);
    }
  }
);
// Creates a user
router.post('/', async (req, res, next) => {
  try {
    // Require the data
    const userData = req.body;
    // Creates the salts
    const salts = await bcrypt.genSalt(10);
    // Hashes the password
    const hashedPassword = await bcrypt.hash(userData.password, salts);
    // Creates a new User
    const newUser = new User({
      uuid: v4(),
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      gamesPlayed: 0,
      country: userData.country,
      city: userData.city,
      friends: []
    });

    // Saves the new user
    await newUser.save();

    res.status(201).json(newUser);
  } catch(err) {
    const validationError = err.name;
    if(validationError == "ValidationError") {
      res.status(400).json(
        {
          "Error": "Bad request. Missing arguments."
        });
    } else {
      res.status(409).json(
        {
          "Error": "Username or email alredy in use."
        });
    }
  }
});

router.delete('/:uuid', passport.authenticate('jwt', {
    session: false,
  }),
  async (req, res, next) => {
    try {
      // Require the data
      const uuidParam = req.params.uuid;
      // Delete the user
      const deletedUser = await User.findOneAndDelete({ uuid: uuidParam });
      // If something was returned
      if(deletedUser) {
        res.status(200).json({deletedUser: deletedUser.username});
      } else {
        res.status(404).json(
          {
            "Error": "User does not exists."
          });
      }
    } catch (err) {
      res.json(err);
    }
  }
);

module.exports = router;
