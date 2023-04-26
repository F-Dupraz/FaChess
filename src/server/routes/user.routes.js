const express = require('express');

// Imports the uuid module
const { v4 } = require('uuid');

// Imports the bcrypt module
const bcrypt = require('bcrypt');

// Imports the User module
const User = require('../db/models/user.model');

// Creates the router
const router = express.Router();

// Creates a user
router.post('/', async (req, res, next) => {
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
    gamesPLayed: 0,
    country: userData.country,
    city: userData.city,
    friends: []
  });

  // Saves the new user
  await newUser.save();

  res.status(200).json(newUser);
});

module.exports = router;
