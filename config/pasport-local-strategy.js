const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require('../models/user');

// Authentication using passport
passport.use(
	new LocalStrategy(
		{
			usernameField: "email",
			//this allow us to first argument as req function call
			passReqToCallback: true,
		},
		async function (req,email, password, done) {
			try {
				const user = await User.findOne({ email: email });

				if (!user || user.password != password) {
					// console.log(`Invalid Password`);
					req.flash('error',`Invalid Username OR Password`);
					return done(null, false);
				}

				return done(null, user);
			} catch (err) {
				// console.log("Error in passportJS", err);
				req.flash('error',`Error you got ${err}`);
				return done(err);
			}
		}
	)
);


// Serializing the user to decide which key is to be kept in the cookies

passport.serializeUser(function (user, done) {
	//we want to store user id in encrypted format
	//this will do it automatically into the cookies
    done(null, user.id)
})

// deserializing the user from the key in the cookies
//taking information of the key from the cookies is deserialize
passport.deserializeUser(async function (id, done) {
	try {
		//find the user is present in the db
		const user = await User.findById(id);

		return done(null, user);
	} catch (err) {
		console.log("Error in passportJS", err);
		return done(err);
	}
});



//sending data to the current user to the view
// Check if the user is authenticated

passport.checkAuthentication = function (req, res, next) {
    // if the user is signed in, then pass on the request to the next function (controller's action)
    if (req.isAuthenticated()) {
        return next()
    }

    //  if the user is not signed in

    return res.redirect('/user/sign-in');
}

passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        // re.user contains the current signed in user from the session cookies and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;

