const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const fs = require('fs');
const path = require('path');
const User = require('../models/user');

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

// At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 'Authorization' header is expected in the format: 'Bearer <access_token>'
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
};

// index.js will pass the global passport object here, and this function will configure it
module.exports = (passport) => {
  // The JWT payload is passed into the verify callback
  passport.use(
    new JwtStrategy(options, (jwt_payload, done) => {
      User.findByPk(jwt_payload.sub).then((result) => done(null, result)).catch((err) => console.log(err));
    }),
  );
};
