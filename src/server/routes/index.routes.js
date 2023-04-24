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

module.exports = router;
