const express = require('express');

// Import the routes
const frontendRouter = require('./frontend.routes');
const userRouter = require('./user.routes');

// Creates the router
const router = express.Router();

router.use('/', frontendRouter);
router.use('/api/v1/users', userRouter);

module.exports = router;
