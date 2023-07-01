//every time when we create express it will not make new instance
//it will just fetch the existing instance

const express=require("express");
//this will help in separate myApp.router and my controller

const router=express.Router();
const userApi=require('../../../controllers/api/v1/users_api')
router.post('/create-session',userApi.createSession);

module.exports=router;