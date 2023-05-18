const { Strategy, ExtractJwt } = require('passport-jwt');

require('dotenv').config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

const jwtStrategyFunction = new Strategy(options, (payload, done) => {
  done(null, payload);
});

module.exports = jwtStrategyFunction;
