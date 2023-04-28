const express = require('express');
const path = require('path');

// Creates the router
const router = express.Router();

// Set the views path
const views = path.join(__dirname, '..', '..', 'views');

// Send the index.html file to the root
router.get('/', (req, res) => {
  res.sendFile(views + '/index.html');
});

// Send the register.html file to the register path
router.get('/register', (req, res) => {
  res.sendFile(views + '/register.html');
});

// Send the userpage.html file to the user/uuid path
router.get('/userpage', (req, res) => {
  res.sendFile(views + '/userpage.html');
});

module.exports = router;
