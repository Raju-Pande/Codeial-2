//every time when we create express it will not make new instance
//it will just fetch the existing instance

const express=require("express");
//this will help in separate myApp.router and my controller

const router=express.Router();

const pasport=require("passport"); //import the bcz of checking authenticated..
//now we link our route to post api controller posts_api.js
// ../ is leave one folder above

const postsApi=require("../../../controllers/api/v1/post_api")
//this refer to the controllers api/v1/posts_api.js

router.get('/',postsApi.index)
//delete router
router.delete('/:id',pasport.authenticate('jwt',{session:false}),postsApi.destroy);
//also need to check authorization we need to go on controllers/api/vi/posts_api.js

module.exports=router;  