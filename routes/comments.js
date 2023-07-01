const express = require('express');
const router = express.Router();
//i need there this bcz we need to check that no one can post without signIn 
//for checking purpose we need to check using passport authentication
const passport = require('passport');

// import the post_controller file here 

const commentsController = require('../controllers/comments_controller');

//we user here checkAuthentication bcz we need to take care that no other then who signIn can post

router.post('/create', passport.checkAuthentication, commentsController.create);
// delete comment
//create a routes for deleting the comments

router.get('/destroy/:id', passport.checkAuthentication, commentsController.destroy);


module.exports = router;