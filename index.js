// dotenv
const dotenv = require('dotenv').config();

const express = require("express");
// cookie insatll:  npm i cookie-parser

// Enviroment 
const env = require('./config/environment');

// morgan
const logger = require('morgan')


const cookieParser = require('cookie-parser'); //this is plug in for storing cookies


const app = express(); //for server start
// view helper
require('./config/view-helpers')(app); //this is call for view-helper
//define port
const port = 8000;

// mpngpDb Conneected

const db = require('./config/mongoose')


const mongoose = require('mongoose');

// Used for session cookie
//used for session cookies...................
// express-session is a popular middleware module for the Express web framework in Node.js.
// It provides session management capabilities to web applications by
// maintaining session state on the server-side and associating a unique session ID with each client.

const session = require('express-session');
const passport = require('passport'); //call passportJs
const passportLocal = require('./config/pasport-local-strategy');

// passport JWT
//making the passportJwt for authentication without cookies
//importing the config folder which handle the passportJWT

const passportJWT = require('./config/passport-jwt-strategy');

// Google auth
const passportGoogle = require('./config/passport-google-oauth2-strategy');

// connection to monodb
//this is for the setting for the page that after refresh then also we still in signIn out page
//using session cookies
const MongoStore = require("connect-mongo");

// SASS
//SCSS/SASS FILE required
// const sassMiddleware = require("node-sass-middleware");

// Flash
//now need to show some notification the user connect-flash

const flash = require('connect-flash');
//now we need to require this FlashMsg so we use middleware
//middleware.js
const customMware = require("./config/middleware")


// chatbox
// setup the chat server to be used socket.io
const chatServer = require('http').Server(app); //server create for socket
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');

const path = require("path");
//deployment
//we don't want to run everyTime in production MODE,so we did...
// if (env.name == 'development') {
//     app.use(sassMiddleware({
//         src: path.join(__dirname, env.asset_path, 'scss'),
//         dest: path.join(__dirname, env.asset_path, 'css'),
//         debug: true,
//         outputStyle: 'extended',
//         prefix: '/css'
//     })
//     )
// }

//middleWare
app.use(express.urlencoded({ extended: false }));   //body-parser deprecated undefined extended: provide extended option

//need to set cookieParser
app.use(cookieParser());

// static file
app.use(express.static(path.join(__dirname,env.asset_path)));

//we have use this for path should ce available for the browser
//find the folder using express.static
// index/codetalk.uploads
// make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

// morgan
//morgan and production logic
app.use(logger(env.morgan.mode, env.morgan.options))

// Creating a Layout
//express-ejs-layouts is a middleware for the Express web application framework
//that allows you to use layouts in your views using the EJS template engine.

const expressLayouts = require('express-ejs-layouts');

app.use(expressLayouts);


// extract style and script fron sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// set up view engine
// //use express router coming from router
// //fetching from router
// // "/" mean home page
// app.use("/", require("./routes/"));

//setup the view engines
//needs to install ejs for look
app.set('view engine', 'ejs')
app.set('views', './views')

// Mongo Store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    // TODO change the secret before deploy in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    // conntection to mongodb
    store: MongoStore.create({
        mongoUrl: 'mongodb://0.0.0.0:27017/Manual_Authenction',
        mongooseConnection: db,
        autoRemvoe: 'disabled'
    },
        function (err) {
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));
app.use(passport.initialize());
app.use(passport.session());


//call the function as middleware
//and user where set in the locals
//user should access able in views
app.use(passport.setAuthenticatedUser)

// flash 
//we use here of flash-notification
//it will store the flashMsg into the cookies so we write here ...
app.use(flash());
//use customMiddleware
app.use(customMware.setFlash);

// use exprss router here
//use express router coming from router
//fetching from router
// "/" mean home page
app.use('/', require('./routes'));



//start you server from here
app.listen(port, function (err) {
    if (err) {
        //interpolation learn
        console.log(`Error in running the server : ${err}`);
        return;
    }
    console.log(`Server is running on port: ${port} ${env.name}`);
})