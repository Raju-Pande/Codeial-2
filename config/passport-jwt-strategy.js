//working with  passport then need to require passportJs
const passport = require("passport");
//setting Strategy of the passportJWT
const jwtStrategy= require('passport-jwt').Strategy;
//a modules which help extract jwt from the header
const ExtractJWT = require('passport-jwt').ExtractJwt;
//now need to fetch or UserSchema //taken userSchema
const User = require('../models/user');

const env = require('./environment');
// let make a details setting..
// header is list of keys inside....
// authentication this also have lot of keys
// this keys know as Bearer which store token
let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),//making token
    secretOrKey: env.jwt_secret_key
};
passport.use(new jwtStrategy(opts, async function (jwtPayload, done) {
	//find the user information base on the jwtPayload
	//we store all details in the jwtPayloads in encrypted form
	try {
			const user = await User.findById(jwtPayload._id)
			if (user) {
				//user found
				return done(null, user);
			} else {
				//user not found
				return done(null, false);
			}
		} catch (err) {
			//getting error
			console.log(err);
			return done(err, false);
		}
	})
);

module.exports = passport;
