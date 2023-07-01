//enter point of all the routes
//every time when we create express it will not make new instance
//it will just fetch the existing instance

const express=require("express")
// const pasport=require('passport')
//this will help in separate myApp.router and my controller

const router=express.Router();

//*****************************************************************************************//
//get from controller home_controller
//fetching from controllers

const homeController = require('../controllers/home_controller');

// console.log('router loaded');

//get from controller home_controller//this is access

router.get('/', homeController.home);


// for any further routes, access from here
// router.use('/routerName', require('./routerfile));
//i want that this will be the main head of all routes in routes file
//so for that i will do access to the users.js connect with index.js router
// calling home/users--->
router.use('/user',require('./users'))
// Post
//call to the posts.js file
router.use('/posts',require('./post'))
//$$$$$$$$$$$$$$EXAMPLE$$$$$$$$$$$$$$$$$$$$$$
//for any other routers, access form here
//router.use('/routerName',require('./routerFile'));

// comment
//call the comments.js route
router.use('/comments',require('./comments'))

// like
//this is for the like routing
router.use('/likes',require('./likes'))
// home_controller.js

//@@@@@@@@@@@@@@@@@ Post use
//use post_controller.js connect with index.js router
// router.use('/post_controller',require('./post_controller'));

//now the root of the router file should know the
//API folder has been created and in used ...
//se we link it with API folder
// api
router.use('/api',require('./api'));

// This will export to the index.js so that it will be use by
//index.js
module.exports=router;