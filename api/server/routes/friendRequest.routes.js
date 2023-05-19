const express = require('express');

// Imports the FriendRequest module
const FriendRequest = require('../db/models/friendRequest.model');

// Imports the User module
const User = require('../db/models/user.model');

// Imports the passport module
const passport = require('passport');

// Creates the router
const router = express.Router();

// Finds all requests
router.get('/all', passport.authenticate('jwt', {
    session: false,
  }),
  async (req, res, next) => {
    try {
      // Searchs all requests in the DB
      const requests = await FriendRequest.find().select('status from to').lean();

      res.status(200).json(requests);
    } catch (err) {
      res.json(err);
    }
  }
);

// Finds a request by to
router.post('/one', passport.authenticate('jwt', {
    session: false,
  }),
  async (req, res, next) => {
    try {
      const { to } = req.body;
      // Searchs a request in the DB with this uuid
      const friendRequest = await FriendRequest.find({ status: true, to: to }).lean();
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

// Makes a request
router.post('/', passport.authenticate('jwt', {
    session: false,
  }),
  async (req, res, next) => {
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
  }
);

router.patch('/addFriend', passport.authenticate('jwt', {
    session: false,
  }),
  async (req, res, next) => {
    try {
      // Require the data
      const data = req.body;
      // Finds the request
      const friendRequest = await FriendRequest.updateOne({ status: true, to: data.to, from: data.from }, {
        status: false
      });

      const userFrom = await User.updateOne({ username: data.from }, {
        $push: {
          friends: {
            username: data.to
          }
        }
      });
      const userTo = await User.updateOne({ username: data.to }, {
        $push: {
          friends: {
            username: data.from
          }
        }
      });

      await friendRequest.save();
      await userFrom.save();
      await userTo.save();

      res.status(204).json(friendRequest);
    } catch(err) {
      res.json(err);
    }
  }
);

router.delete('/', passport.authenticate('jwt', {
    session: false,
  }),
  async (req, res, next) => {
    try {
      // Require the data
      const data = req.body;
      // Finds the request
      const friendRequest = await FriendRequest.deleteOne({ status: true, to: data.to, from: data.from });

      await friendRequest.save();

      res.status(204).json(friendRequest);
    } catch(err) {
      res.json(err);
    }
  }
)

module.exports = router;
