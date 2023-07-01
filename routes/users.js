const express = require("express");
const router = express.Router();

// passport 
//require the passportJs
const passport = require("passport");

const userController = require('../controllers/users_controller')
// console.log("router loaded");

// router.get('/profile',passport.checkAuthentication, userController.profile);
// //map the usersController with users Router
// router.get("/profile",passport.checkAuthentication, usersController.profile);

//map the usersController with users Router with passport js
//we update this :id bcz we want to show all User list
// home/users/profile:id
// user profile link
router.get('/profile/:id', passport.checkAuthentication, userController.profile);
//this is the update part
//here we update the user name and email if he want...
router.post('/update/:id', passport.checkAuthentication, userController.update);

//show if the user sign-up notification coming from views
        
router.get('/sign-up', userController.signUp);
//show if the user sign-in

router.get('/sign-in', userController.signIn);
//need to track for the ejs form files

router.post('/create', userController.create)

// router.post('/create-session', userController.createSession)


// use passport as a middleware to authenticate
//this will be handle by the passportJS so middleware is in middle added as passport.authentication function

router.post('/create-session', 
//if it true then goes to usersController otherwise redirect
passport.authenticate('local', { failureRedirect: '/user/sign-in' }), userController.createSession)

// Sign Out

router.get('/sign-out',userController.destroySession);

// google auth
//here we define two routes
//for third party oauth using google oauth
//'/auth/google' this is given by the passportJS
//passport.authenticate('google',{}) first argument is Strategy & second one is Scope
//scope is the information which we are fetching

router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
//2nd route
//this is redirecting to the home page..
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/user/sign-in'}),userController.createSession);


module.exports = router;