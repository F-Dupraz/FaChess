const express = require('express');

// Import the routes
const frontendRouter = require('./frontend.routes');
const userRouter = require('./user.routes');
const authRouter = require('./auth.routes');

// Creates the router
const router = express.Router();

router.use('/', frontendRouter);
router.use('/api/v1/users', userRouter);
router.use('/api/v1/auth', authRouter);

module.exports = router;
