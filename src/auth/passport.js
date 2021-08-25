// const passport = require("passport");
// const passportJwt = require("passport-jwt");
// const ExtractJwt = passportJwt.ExtractJwt;
// const StrategyJwt = passportJwt.Strategy;
// const User = require("../models/user");
//
// passport.use(
//   new StrategyJwt(
//     {
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: process.env.JWT_SECRET,
//     },
//     function (jwtPayload, done) {
//       return User.findOne({ where: { id: jwtPayload.id } })
//         .then((user) => {
//           return done(null, user);
//         })
//         .catch((err) => {
//           return done(err);
//         });
//     }
//   )
// );

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
      //console.log(jwt_payload);

      User.findByPk(jwt_payload.sub).then((result)=> {
        return done(null, result);
      }).catch((err) => console.log(err));

      // We will assign the `sub` property on the JWT to the database ID of user
      // User.findOne({ where: { id: jwt_payload.sub } }, (err, user) => {
      //   // This flow look familiar?  It is the same as when we implemented
      //   // the `passport-local` strategy
      //   if (err) {
      //     console.log('User found');
      //     return done(err, false);
      //   }
      //
      //   if (user) {
      //     console.log('User found');
      //     return done(null, user);
      //   }
      //
      //   return done(null, false, { message: 'User not found' });
      // });
    }),
  );
};
