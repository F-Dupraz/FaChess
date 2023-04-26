const express = require('express');
const path = require('path');
const { createServer } = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

// Import the DB
require('./db/index');

// Import routes
const router = require('./routes/index.routes');

// Creates server function
function createServerApp() {
  const app = express();
  // Create the http server
  const httpServer = createServer(app);

  app.set('port', process.env.SERVER_PORT);

  // Setting the views path
  app.set('views', __dirname + '/../views');

  // Use static files
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // Suport json-encoded bodies
  app.use(express.json());
  app.use(bodyParser.json());

  // Suport url-encoded bodies
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  // Suport cookies
  app.use(cookieParser());

  // Suport cross-origin resourse sharing
  app.use(cors());

  // Use router
  app.use(router);

  // Return the server
  return httpServer;
}

module.exports = createServerApp;
