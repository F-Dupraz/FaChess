const express = require('express');

// Imports the FriendRequest module
const FriendRequest = require('../db/models/friendRequest.model');

// Creates the router
const router = express.Router();

// Finds all requests
router.get('/all',
  async (req, res, next) => {
    try {
      // Searchs all requests in the DB
      const requests = await FriendRequest.find();

      res.status(200).json(requests);
    } catch (err) {
      res.json(err);
    }
  }
);

// Finds a request by to
router.post('/one',
  async (req, res, next) => {
    try {
      const userUsername = req.body.userUsername;
      // Searchs a request in the DB with this uuid
      const friendRequest = await FriendRequest.find({ status: true, to: userUsername });
      // If something was returned
      if(friendRequest) {
        res.status(200).json(friendRequest);
      } else {
        res.status(404).json(
          {
            "Error": "Request does not exists."
          });
      }
    } catch (err) {
      res.json(err);
    }
  }
);

// Modifies a request
router.post('/', async (req, res, next) => {
  try {
    // Modifies the data
    const requestData = req.body;
    // Creates a new request
    const newFriendRequest = new FriendRequest({
      from: requestData.from,
      to: requestData.to
    });

    // Saves the new request
    await newFriendRequest.save();

    res.status(201).json(newFriendRequest);
  } catch(err) {
    res.status(400).json(
      {
        "Error": "Bad request. Missing arguments."
      });
  }
});

router.patch('/',
  async (req, res, next) => {
    try {
      // Require the data
      const data = req.body;
      // Finds the request
      const friendRequest = await FriendRequest.findOne({ status: true, to: data.to });
      
      await friendRequest.save();

      res.status(204).json(friendRequest);
    } catch(err) {
      res.json(err);
    }
  }
);

module.exports = router;
